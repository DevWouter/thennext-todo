import { Migrator, MigrationInterface } from "./util";

export class Migration_20190104220641_remove_private_key implements MigrationInterface {
    readonly name = "20190104220641-remove-private-key";

    async up(migrator: Migrator): Promise<void> {
        migrator.execute('ALTER TABLE `TaskList` DROP COLUMN `privateKeyHash`');
    }

    async down(migrator: Migrator): Promise<void> {
        migrator.execute('ALTER TABLE `TaskList` ADD COLUMN `privateKeyHash` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL');
    }
}
