import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTaskTimeLapTable1525370138716 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `TaskTimeLap` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(36) NOT NULL UNIQUE, `startTime` datetime NOT NULL, `endTime` datetime, `taskId` int(11) NOT NULL, `ownerId` int(11) NOT NULL) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `TaskTimeLap` ADD CONSTRAINT `fk_b3e310c3c1d80eabf988f236a10` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE CASCADE");
        await queryRunner.query("ALTER TABLE `TaskTimeLap` ADD CONSTRAINT `fk_d61e5dd4beb73adaecf9c7adc99` FOREIGN KEY (`ownerId`) REFERENCES `Account`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `TaskTimeLap` DROP FOREIGN KEY `fk_d61e5dd4beb73adaecf9c7adc99`");
        await queryRunner.query("ALTER TABLE `TaskTimeLap` DROP FOREIGN KEY `fk_b3e310c3c1d80eabf988f236a10`");
        await queryRunner.query("DROP TABLE `TaskTimeLap`");
    }

}
