import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertToUtf81529346268141 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const databaseName = queryRunner.connection.options.database;
        await queryRunner.query(`ALTER DATABASE \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`)

        const allTables = [
            "Account",
            "AccountSettings",
            "ChecklistItem",
            "ScoreShift",
            "Session",
            "Task",
            "TaskList",
            "TaskListRight",
            "TaskListShareToken",
            "TaskRelation",
            "TaskTimeLap",
        ];

        for (let index = 0; index < allTables.length; index++) {
            const tableName = allTables[index];
            await queryRunner.query(`ALTER TABLE \`${tableName}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
