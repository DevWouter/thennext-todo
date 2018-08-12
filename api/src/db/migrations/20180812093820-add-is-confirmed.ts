import { Migrator, MigrationInterface } from "./util";

export class Migration_20180812093820_add_is_confirmed implements MigrationInterface {
    readonly name = "20180812093820-add-is-confirmed";

    async up(migrator: Migrator): Promise<void> {
        migrator.execute('ALTER TABLE `Account` ADD COLUMN `is_confirmed` BIT');
        migrator.execute('UPDATE `Account` SET `is_confirmed`=1');
        migrator.execute('ALTER TABLE `Account` ALTER `is_confirmed` SET DEFAULT 0');
        migrator.execute('ALTER TABLE `Account` MODIFY `is_confirmed` BIT NOT NULL');
    }

    async down(migrator: Migrator): Promise<void> {
        migrator.execute('ALTER TABLE `Account` DROP COLUMN `is_confirmed`');
    }
}