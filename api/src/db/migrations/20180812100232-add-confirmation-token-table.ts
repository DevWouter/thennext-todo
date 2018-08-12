import { Migrator, MigrationInterface } from "./util";

export class Migration_20180812100232_add_confirmation_token_table implements MigrationInterface {
    readonly name = "20180812100232-add-confirmation-token-table";

    async up(migrator: Migrator): Promise<void> {
        await migrator.execute([
            " CREATE TABLE `ConfirmationToken` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `accountId` int(11) NOT NULL, ",
            "   `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `createdAt` datetime NOT NULL, ",
            "   `validUntil` datetime NOT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   KEY `fk_confirmationToken_account` (`accountId`), ",
            "   CONSTRAINT `fk_confirmationToken_account` FOREIGN KEY (`accountId`) REFERENCES `Account` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);
    }

    async down(migrator: Migrator): Promise<void> {
        migrator.execute('DROP TABLE `ConfirmationToken`');
    }
}