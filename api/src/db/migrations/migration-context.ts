import { AllMigrations } from './all-migrations';
import { Connection } from 'mysql';
import { Migrator } from './util';

interface MigrationEntity {
    migrationName: string;
    at: Date;
}

export class MigrationContext {
    constructor(
        private readonly connection: Connection,
    ) {
        // Check if the AllMigrations table has all migrations in order
        const migrationNames = AllMigrations.map(x => x.name);
        for (let i = 1; i < migrationNames.length; ++i) {
            const a = migrationNames[i - 1]; // Prev
            const b = migrationNames[i];
            if (a < b) continue; // If true, then the names are in the correct order.

            throw new Error(
                `In "AllMigrations" the order of migrations is wrong.` +
                ` Migration ${a} should be after ${b} and not before`);
        }
    }

    async up(): Promise<void> {
        let migrator = new Migrator(this.connection);
        await this.ensureMigrationTable(migrator);

        // Sort the executed migration
        const executedMigrations = (await this.getExecutedMigrations(migrator))
            .sort((a, b) => {
                if (a.migrationName < b.migrationName) return -1;
                if (a.migrationName > b.migrationName) return 1;
                return 0;
            });

        for (let index = 0; index < AllMigrations.length; index++) {
            const migration = AllMigrations[index];
            // Check if the migration should already have been executed.
            if (executedMigrations.length > index) {
                // The migration should be executed.
                // Check if the name matches
                const executedMigrationName = executedMigrations[index].migrationName;
                if (executedMigrationName !== migration.name) {
                    throw new Error(
                        "Migrations are out of order. " +
                        `The ${index} migration in the database is ${executedMigrationName} while ` +
                        `in the application we have ${migration.name}`);
                }

                // If the migration has already been executed, we can skip it.
                continue;
            }

            // NOTE: Sadly MySQL doesn't support transaction that involve alteration to 
            // the schema (like `CREATE TABLE`). So using transaction holds no value.

            try {
                await migration.up(migrator);
            } catch (err) {
                throw { migration: migration.name, inner: err };
            }

            await migrator.execute([
                " INSERT INTO `__Migration` (`migrationName`) VALUES (?)"
            ], [migration.name]);
        }
    }

    down() {
        throw new Error("Not yet implemented");
    }

    private async getExecutedMigrations(migrator: Migrator): Promise<MigrationEntity[]> {
        const { results } = await migrator.execute("SELECT * FROM `__Migration`");
        return results as MigrationEntity[];
    }

    private async ensureMigrationTable(migrator: Migrator): Promise<void> {
        // NOTE
        // In the event we need to change the migration table, we need to split this function
        // and then call various ensurances. 
        // ```
        // await ensureMigrationTableExists();
        // await ensureMigrationTableUpdatedToV1();
        // await ensureMigrationTableUpdatedToV2();
        // ```

        // Ensure that the migration table exists.
        const existsResult = await migrator.execute("SHOW TABLES LIKE '__Migration';");
        if (existsResult.results.length !== 0) {
            return;
        }

        // Tables doesn't exists --> Create table
        await migrator.execute([
            " CREATE TABLE `__Migration` ( ",
            " 	`migrationName` VARCHAR(255) NOT NULL PRIMARY KEY COMMENT 'The name and key of the migration that was executed', ",
            " 	`at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'The date and time when the migration has occured' ",
            " ) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; "
        ]);


    }

}