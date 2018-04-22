import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1521489246069 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `DecaySpeed` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `from` float NOT NULL, `coefficient` float NOT NULL, `accountId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `TagScore` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `name` varchar(255) NOT NULL, `value` float NOT NULL, `accountId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Session` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `token` varchar(255) NOT NULL UNIQUE, `created_on` datetime NOT NULL, `expire_on` datetime NOT NULL, `accountId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `ChecklistItem` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(36) NOT NULL UNIQUE, `checked` tinyint(4) NOT NULL, `title` varchar(512) NOT NULL, `taskId` int(11) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `TaskTag` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `name` varchar(255) NOT NULL, `taskId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `TaskRelation` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `relationType` varchar(255) NOT NULL, `sourceTaskId` int(11), `targetTaskId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Task` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(36) NOT NULL UNIQUE, `title` varchar(255) NOT NULL, `description` text NOT NULL, `status` varchar(255) NOT NULL, `createdAt` datetime NOT NULL, `updatedAt` datetime NOT NULL, `completedAt` datetime NOT NULL, `taskListId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `TaskList` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(255) NOT NULL UNIQUE, `name` varchar(255) NOT NULL, `primary` tinyint(4) NOT NULL, `ownerId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `Account` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(255) NOT NULL UNIQUE, `email` varchar(500) NOT NULL, `password_hash` varchar(500) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `AccountSettings` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `scrollToNewTasks` tinyint(4) NOT NULL, `hideScoreInTaskList` tinyint(4) NOT NULL, `defaultWaitUntil` varchar(255) NOT NULL, `urgencyPerDay` float NOT NULL, `urgencyWhenActive` float NOT NULL, `urgencyWhenDescription` float NOT NULL, `urgencyWhenBlocking` float NOT NULL, `urgencyWhenBlocked` float NOT NULL, `accountId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `DecaySpeed` ADD CONSTRAINT `fk_e3b60fa5172117f92d557c7fbe7` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `TagScore` ADD CONSTRAINT `fk_3356dae427362b08358258af064` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `Session` ADD CONSTRAINT `fk_00f3bf902525d8c6a4d4cfded33` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `ChecklistItem` ADD CONSTRAINT `fk_b04d359139b21e5f8266a774566` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `TaskTag` ADD CONSTRAINT `fk_8643032d49a74ce5cc6b5349681` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `TaskRelation` ADD CONSTRAINT `fk_e2a00f8da102eb56c2ced224b65` FOREIGN KEY (`sourceTaskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `TaskRelation` ADD CONSTRAINT `fk_f72068fcf1f30a2bce5cb75e52d` FOREIGN KEY (`targetTaskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `Task` ADD CONSTRAINT `fk_671ff6ee02892b5c7c80287da32` FOREIGN KEY (`taskListId`) REFERENCES `TaskList`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `TaskList` ADD CONSTRAINT `fk_e861eac5e8a849f09c8358847dd` FOREIGN KEY (`ownerId`) REFERENCES `Account`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `AccountSettings` ADD CONSTRAINT `fk_c4cb4d4c7c3a83e2f9c3e4cc395` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `AccountSettings` DROP FOREIGN KEY `fk_c4cb4d4c7c3a83e2f9c3e4cc395`");
        await queryRunner.query("ALTER TABLE `TaskList` DROP FOREIGN KEY `fk_e861eac5e8a849f09c8358847dd`");
        await queryRunner.query("ALTER TABLE `Task` DROP FOREIGN KEY `fk_671ff6ee02892b5c7c80287da32`");
        await queryRunner.query("ALTER TABLE `TaskRelation` DROP FOREIGN KEY `fk_f72068fcf1f30a2bce5cb75e52d`");
        await queryRunner.query("ALTER TABLE `TaskRelation` DROP FOREIGN KEY `fk_e2a00f8da102eb56c2ced224b65`");
        await queryRunner.query("ALTER TABLE `TaskTag` DROP FOREIGN KEY `fk_8643032d49a74ce5cc6b5349681`");
        await queryRunner.query("ALTER TABLE `ChecklistItem` DROP FOREIGN KEY `fk_b04d359139b21e5f8266a774566`");
        await queryRunner.query("ALTER TABLE `Session` DROP FOREIGN KEY `fk_00f3bf902525d8c6a4d4cfded33`");
        await queryRunner.query("ALTER TABLE `TagScore` DROP FOREIGN KEY `fk_3356dae427362b08358258af064`");
        await queryRunner.query("ALTER TABLE `DecaySpeed` DROP FOREIGN KEY `fk_e3b60fa5172117f92d557c7fbe7`");
        await queryRunner.query("DROP TABLE `AccountSettings`");
        await queryRunner.query("DROP TABLE `Account`");
        await queryRunner.query("DROP TABLE `TaskList`");
        await queryRunner.query("DROP TABLE `Task`");
        await queryRunner.query("DROP TABLE `TaskRelation`");
        await queryRunner.query("DROP TABLE `TaskTag`");
        await queryRunner.query("DROP TABLE `ChecklistItem`");
        await queryRunner.query("DROP TABLE `Session`");
        await queryRunner.query("DROP TABLE `TagScore`");
        await queryRunner.query("DROP TABLE `DecaySpeed`");
    }

}
