import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameContextToTaskList1520786422795 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Task` DROP FOREIGN KEY `fk_4282ad8cf47776f942609ab28d7`");
        await queryRunner.query("CREATE TABLE `TaskList` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(255) NOT NULL UNIQUE, `name` varchar(255) NOT NULL, `primary` tinyint(4) NOT NULL, `ownerId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `test`.`Task` DROP `contextId`");
        await queryRunner.query("ALTER TABLE `test`.`Task` ADD `taskListId` int(11)");
        await queryRunner.query("ALTER TABLE `test`.`Task` ADD CONSTRAINT `fk_671ff6ee02892b5c7c80287da32` FOREIGN KEY (`taskListId`) REFERENCES `TaskList`(`id`)");
        await queryRunner.query("ALTER TABLE `TaskList` ADD CONSTRAINT `fk_e861eac5e8a849f09c8358847dd` FOREIGN KEY (`ownerId`) REFERENCES `Account`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `TaskList` DROP FOREIGN KEY `fk_e861eac5e8a849f09c8358847dd`");
        await queryRunner.query("ALTER TABLE `test`.`Task` DROP FOREIGN KEY `fk_671ff6ee02892b5c7c80287da32`");
        await queryRunner.query("ALTER TABLE `test`.`Task` DROP `taskListId`");
        await queryRunner.query("ALTER TABLE `test`.`Task` ADD `contextId` int(11)");
        await queryRunner.query("DROP TABLE `TaskList`");
        await queryRunner.query("ALTER TABLE `test`.`Task` ADD CONSTRAINT `fk_4282ad8cf47776f942609ab28d7` FOREIGN KEY () REFERENCES ``()");
    }

}
