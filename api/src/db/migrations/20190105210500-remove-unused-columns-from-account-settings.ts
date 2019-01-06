import { Migrator, MigrationInterface } from "./util";

export class Migration_20190105210500_remove_unused_columns_from_account_settings implements MigrationInterface {
    readonly name = "20190105210500-remove-unused-columns-from-account-settings";

    async up(migrator: Migrator): Promise<void> {
        await migrator.execute("ALTER TABLE `AccountSettings` DROP COLUMN `scrollToNewTasks`");
        await migrator.execute("ALTER TABLE `AccountSettings` DROP COLUMN `hideScoreInTaskList`");
        await migrator.execute("ALTER TABLE `AccountSettings` DROP COLUMN `defaultWaitUntil`");
        await migrator.execute("ALTER TABLE `AccountSettings` DROP COLUMN `urgencyPerDay`");
        await migrator.execute("ALTER TABLE `AccountSettings` DROP COLUMN `urgencyWhenActive`");
        await migrator.execute("ALTER TABLE `AccountSettings` DROP COLUMN `urgencyWhenDescription`");
        await migrator.execute("ALTER TABLE `AccountSettings` DROP COLUMN `urgencyWhenBlocking`");
        await migrator.execute("ALTER TABLE `AccountSettings` DROP COLUMN `urgencyWhenBlocked`");
    }

    async down(migrator: Migrator): Promise<void> {
        await migrator.execute("ALTER TABLE `AccountSettings` ADD COLUMN `scrollToNewTasks` tinyint(4)");
        await migrator.execute("ALTER TABLE `AccountSettings` ADD COLUMN `hideScoreInTaskList` tinyint(4)");
        await migrator.execute("ALTER TABLE `AccountSettings` ADD COLUMN `defaultWaitUntil` varchar(255) COLLATE utf8mb4_unicode_ci");
        await migrator.execute("ALTER TABLE `AccountSettings` ADD COLUMN `urgencyPerDay` float");
        await migrator.execute("ALTER TABLE `AccountSettings` ADD COLUMN `urgencyWhenActive` float");
        await migrator.execute("ALTER TABLE `AccountSettings` ADD COLUMN `urgencyWhenDescription` float");
        await migrator.execute("ALTER TABLE `AccountSettings` ADD COLUMN `urgencyWhenBlocking` float");
        await migrator.execute("ALTER TABLE `AccountSettings` ADD COLUMN `urgencyWhenBlocked` float");

        await migrator.execute([
            "UPDATE `AccountSettings` SET",
            "   `scrollToNewTasks` = 1,",
            "   `hideScoreInTaskList` = 0,",
            "   `defaultWaitUntil` = '07:00',",
            "   `urgencyPerDay` = 2,",
            "   `urgencyWhenActive` = 4,",
            "   `urgencyWhenDescription` = 1,",
            "   `urgencyWhenBlocking` = 8,",
            "   `urgencyWhenBlocked` = 5",
        ]);

        await migrator.execute("ALTER TABLE `AccountSettings` MODIFY `scrollToNewTasks` tinyint(4) NOT NULL");
        await migrator.execute("ALTER TABLE `AccountSettings` MODIFY `hideScoreInTaskList` tinyint(4) NOT NULL");
        await migrator.execute("ALTER TABLE `AccountSettings` MODIFY `defaultWaitUntil` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL");
        await migrator.execute("ALTER TABLE `AccountSettings` MODIFY `urgencyPerDay` float NOT NULL");
        await migrator.execute("ALTER TABLE `AccountSettings` MODIFY `urgencyWhenActive` float NOT NULL");
        await migrator.execute("ALTER TABLE `AccountSettings` MODIFY `urgencyWhenDescription` float NOT NULL");
        await migrator.execute("ALTER TABLE `AccountSettings` MODIFY `urgencyWhenBlocking` float NOT NULL");
        await migrator.execute("ALTER TABLE `AccountSettings` MODIFY `urgencyWhenBlocked` float NOT NULL");


        migrator.execute('ALTER TABLE `Account` ALTER `is_confirmed` SET DEFAULT 0');
    }
}
