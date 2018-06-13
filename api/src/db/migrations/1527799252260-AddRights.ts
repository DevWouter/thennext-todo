import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRights1527799252260 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`AccountSettings` ADD `primaryListId` int(11)");
        await queryRunner.query(
            "UPDATE `AccountSettings` " +
            "INNER JOIN `Account` ON `AccountSettings`.`accountId`=`Account`.`id` " +
            "INNER JOIN `TaskList` ON `TaskList`.`ownerId`=`Account`.`id` " +
            "SET `AccountSettings`.`primaryListId`=`TaskList`.`id` " +
            "WHERE `TaskList`.`primary`=1");
        await queryRunner.query("ALTER TABLE `test`.`TaskList` DROP `primary`");
        await queryRunner.query("CREATE TABLE `TaskListRight` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(255) NOT NULL UNIQUE, `access` varchar(255) NOT NULL, `accountId` int(11), `taskListId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `TaskListRight` ADD CONSTRAINT `fk_a062a2fc64e05cc938654ec94d0` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`)");
        await queryRunner.query("ALTER TABLE `TaskListRight` ADD CONSTRAINT `fk_5c413e440d3840d1ff19304204a` FOREIGN KEY (`taskListId`) REFERENCES `TaskList`(`id`)");
        await queryRunner.query("ALTER TABLE `test`.`AccountSettings` ADD CONSTRAINT `fk_a1c10473706848c46106bc36220` FOREIGN KEY (`primaryListId`) REFERENCES `TaskList`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`AccountSettings` DROP FOREIGN KEY `fk_a1c10473706848c46106bc36220`");
        await queryRunner.query("ALTER TABLE `TaskListRight` DROP FOREIGN KEY `fk_5c413e440d3840d1ff19304204a`");
        await queryRunner.query("ALTER TABLE `TaskListRight` DROP FOREIGN KEY `fk_a062a2fc64e05cc938654ec94d0`");
        await queryRunner.query("ALTER TABLE `test`.`AccountSettings` DROP `primaryListId`");
        await queryRunner.query("ALTER TABLE `test`.`TaskList` ADD `primary` tinyint(4) NOT NULL DEFAULT 0");
        await queryRunner.query("DROP TABLE `TaskListRight`");
    }

}
