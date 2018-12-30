import { Migrator, MigrationInterface } from "./util";

export class Migration_20181230211754_add_time_estimate_to_task implements MigrationInterface {
    readonly name = "20181230211754-add-time-estimate-to-task";

    async up(migrator: Migrator): Promise<void> {
        // All time units will be estimated in seconds
        migrator.execute('ALTER TABLE `Task` ADD COLUMN `estimatedDuration` INT DEFAULT NULL');
    }

    async down(migrator: Migrator): Promise<void> {
        migrator.execute('ALTER TABLE `Task` DROP COLUMN `estimatedDuration`');
    }
}