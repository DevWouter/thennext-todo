import { Migrator, MigrationInterface } from "./util";

export class Migration_20190105165437_remove_table_tasklist_right implements MigrationInterface {
    readonly name = "20190105165437-remove-table-tasklist-right";

    async up(migrator: Migrator): Promise<void> {
        await migrator.execute(["DROP TABLE `TaskListRight`;"]);
    }

    async down(migrator: Migrator): Promise<void> {
        //  Create table `TaskListRight`
        await migrator.execute([
            " CREATE TABLE `TaskListRight` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `access` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `accountId` int(11) DEFAULT NULL, ",
            "   `taskListId` int(11) DEFAULT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_a062a2fc64e05cc938654ec94d0` (`accountId`), ",
            "   KEY `fk_5c413e440d3840d1ff19304204a` (`taskListId`), ",
            "   CONSTRAINT `fk_5c413e440d3840d1ff19304204a` FOREIGN KEY (`taskListId`) REFERENCES `TaskList` (`id`) ON DELETE CASCADE, ",
            "   CONSTRAINT `fk_a062a2fc64e05cc938654ec94d0` FOREIGN KEY (`accountId`) REFERENCES `Account` (`id`) ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);
    }
}
