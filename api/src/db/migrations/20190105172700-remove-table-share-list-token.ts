import { Migrator, MigrationInterface } from "./util";

export class Migration_20190105172700_remove_table_share_list_token implements MigrationInterface {
    readonly name = "20190105172700-remove-table-share-list-token";

    async up(migrator: Migrator): Promise<void> {
        await migrator.execute(["DROP TABLE `TaskListShareToken`;"]);
    }

    async down(migrator: Migrator): Promise<void> {
        await migrator.execute([
            " CREATE TABLE `TaskListShareToken` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `taskListId` int(11) DEFAULT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_ebbba0a522a6a7b7027416e0666` (`taskListId`), ",
            "   CONSTRAINT `fk_ebbba0a522a6a7b7027416e0666` FOREIGN KEY (`taskListId`) REFERENCES `TaskList` (`id`) ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);
    }
}
