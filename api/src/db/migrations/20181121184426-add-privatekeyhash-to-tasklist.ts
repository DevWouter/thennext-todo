import { Migrator, MigrationInterface } from "./util";

export class Migration_20181121184426_add_privatekeyhash_to_tasklist implements MigrationInterface {
    readonly name = "20181121184426-add-privatekeyhash-to-tasklist";

    async up(migrator: Migrator): Promise<void> {
        migrator.execute('ALTER TABLE `TaskList` ADD COLUMN `privateKeyHash` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL');
    }

    async down(migrator: Migrator): Promise<void> {
        migrator.execute('ALTER TABLE `TaskList` DROP COLUMN `privateKeyHash`');
    }
}
