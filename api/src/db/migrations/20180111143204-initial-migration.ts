import { Migrator, MigrationInterface } from "./util";

export class Migration_20180111143204_initial_migration implements MigrationInterface {
    readonly name = "20180111143204-initial-migration";

    async up(migrator: Migrator): Promise<void> {
        // Create account table
        await migrator.execute([
            " CREATE TABLE `Account` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `email` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `password_hash` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `displayName` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`) ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

        // Create tasklist table
        await migrator.execute([
            " CREATE TABLE `TaskList` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `ownerId` int(11) DEFAULT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_e861eac5e8a849f09c8358847dd` (`ownerId`), ",
            "   CONSTRAINT `fk_e861eac5e8a849f09c8358847dd` FOREIGN KEY (`ownerId`) REFERENCES `Account` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

        // Create AccountSettings table
        await migrator.execute([
            " CREATE TABLE `AccountSettings` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `scrollToNewTasks` tinyint(4) NOT NULL, ",
            "   `hideScoreInTaskList` tinyint(4) NOT NULL, ",
            "   `defaultWaitUntil` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `urgencyPerDay` float NOT NULL, ",
            "   `urgencyWhenActive` float NOT NULL, ",
            "   `urgencyWhenDescription` float NOT NULL, ",
            "   `urgencyWhenBlocking` float NOT NULL, ",
            "   `urgencyWhenBlocked` float NOT NULL, ",
            "   `accountId` int(11) DEFAULT NULL, ",
            "   `primaryListId` int(11) DEFAULT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   KEY `fk_c4cb4d4c7c3a83e2f9c3e4cc395` (`accountId`), ",
            "   KEY `fk_a1c10473706848c46106bc36220` (`primaryListId`), ",
            "   CONSTRAINT `fk_a1c10473706848c46106bc36220` FOREIGN KEY (`primaryListId`) REFERENCES `TaskList` (`id`), ",
            "   CONSTRAINT `fk_c4cb4d4c7c3a83e2f9c3e4cc395` FOREIGN KEY (`accountId`) REFERENCES `Account` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

        // Create table `ScoreShift`
        await migrator.execute([
            " CREATE TABLE `ScoreShift` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `phrase` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `score` int(11) NOT NULL DEFAULT '0', ",
            "   `created_on` datetime NOT NULL, ",
            "   `updated_on` datetime NOT NULL, ",
            "   `ownerId` int(11) DEFAULT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_73e1f703e12617d4e7992558b6f` (`ownerId`), ",
            "   CONSTRAINT `fk_73e1f703e12617d4e7992558b6f` FOREIGN KEY (`ownerId`) REFERENCES `Account` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

        // Create table `Session`
        await migrator.execute([
            " CREATE TABLE `Session` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `created_on` datetime NOT NULL, ",
            "   `expire_on` datetime NOT NULL, ",
            "   `accountId` int(11) DEFAULT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `token` (`token`), ",
            "   KEY `fk_00f3bf902525d8c6a4d4cfded33` (`accountId`), ",
            "   CONSTRAINT `fk_00f3bf902525d8c6a4d4cfded33` FOREIGN KEY (`accountId`) REFERENCES `Account` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

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

        // Create table `TaskListShareToken`
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

        // Create table `UrgencyLap`
        await migrator.execute([
            " CREATE TABLE `UrgencyLap` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `fromDay` decimal(7,3) NOT NULL, ",
            "   `urgencyModifier` decimal(7,3) NOT NULL, ",
            "   `ownerId` int(11) DEFAULT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_ded2ab4d6465d27ff1850e28a73` (`ownerId`), ",
            "   CONSTRAINT `fk_ded2ab4d6465d27ff1850e28a73` FOREIGN KEY (`ownerId`) REFERENCES `Account` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

        // Create table `Task`
        await migrator.execute([
            " CREATE TABLE `Task` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `createdAt` datetime NOT NULL, ",
            "   `updatedAt` datetime NOT NULL, ",
            "   `completedAt` datetime DEFAULT NULL, ",
            "   `taskListId` int(11) DEFAULT NULL, ",
            "   `nextChecklistOrder` int(11) NOT NULL DEFAULT '1', ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_671ff6ee02892b5c7c80287da32` (`taskListId`), ",
            "   CONSTRAINT `fk_671ff6ee02892b5c7c80287da32` FOREIGN KEY (`taskListId`) REFERENCES `TaskList` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

        // Create table `ChecklistItem`
        await migrator.execute([
            " CREATE TABLE `ChecklistItem` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `checked` tinyint(4) NOT NULL, ",
            "   `title` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `taskId` int(11) NOT NULL, ",
            "   `order` int(11) NOT NULL DEFAULT '0', ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_b04d359139b21e5f8266a774566` (`taskId`), ",
            "   CONSTRAINT `fk_b04d359139b21e5f8266a774566` FOREIGN KEY (`taskId`) REFERENCES `Task` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

        // Create table `TaskRelation`
        await migrator.execute([
            " CREATE TABLE `TaskRelation` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `relationType` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `sourceTaskId` int(11) DEFAULT NULL, ",
            "   `targetTaskId` int(11) DEFAULT NULL, ",
            "   `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_e2a00f8da102eb56c2ced224b65` (`sourceTaskId`), ",
            "   KEY `fk_f72068fcf1f30a2bce5cb75e52d` (`targetTaskId`), ",
            "   CONSTRAINT `fk_e2a00f8da102eb56c2ced224b65` FOREIGN KEY (`sourceTaskId`) REFERENCES `Task` (`id`) ON DELETE CASCADE, ",
            "   CONSTRAINT `fk_f72068fcf1f30a2bce5cb75e52d` FOREIGN KEY (`targetTaskId`) REFERENCES `Task` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);

        // Create table `TaskTimeLap`
        await migrator.execute([
            " CREATE TABLE `TaskTimeLap` ( ",
            "   `id` int(11) NOT NULL AUTO_INCREMENT, ",
            "   `uuid` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL, ",
            "   `startTime` datetime NOT NULL, ",
            "   `endTime` datetime DEFAULT NULL, ",
            "   `taskId` int(11) NOT NULL, ",
            "   `ownerId` int(11) NOT NULL, ",
            "   PRIMARY KEY (`id`), ",
            "   UNIQUE KEY `uuid` (`uuid`), ",
            "   KEY `fk_b3e310c3c1d80eabf988f236a10` (`taskId`), ",
            "   KEY `fk_d61e5dd4beb73adaecf9c7adc99` (`ownerId`), ",
            "   CONSTRAINT `fk_b3e310c3c1d80eabf988f236a10` FOREIGN KEY (`taskId`) REFERENCES `Task` (`id`) ON DELETE CASCADE, ",
            "   CONSTRAINT `fk_d61e5dd4beb73adaecf9c7adc99` FOREIGN KEY (`ownerId`) REFERENCES `Account` (`id`) ON DELETE CASCADE ",
            " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; ",
        ]);
    }

    async down(migrator: Migrator): Promise<void> {
        // Delete all tables (needs to be performed in reverse order because of foreign key constrains)
        await migrator.execute(["DROP TABLE `TaskTimeLap`;"]);
        await migrator.execute(["DROP TABLE `TaskRelation`;"]);
        await migrator.execute(["DROP TABLE `ChecklistItem`;"]);
        await migrator.execute(["DROP TABLE `Task`;"]);
        await migrator.execute(["DROP TABLE `UrgencyLap`;"]);
        await migrator.execute(["DROP TABLE `TaskListShareToken`;"]);
        await migrator.execute(["DROP TABLE `TaskListRight`;"]);
        await migrator.execute(["DROP TABLE `Session`;"]);
        await migrator.execute(["DROP TABLE `ScoreShift`;"]);
        await migrator.execute(["DROP TABLE `AccountSettings`;"]);
        await migrator.execute(["DROP TABLE `TaskList`;"]);
        await migrator.execute(["DROP TABLE `Account`;"]);
    }
}