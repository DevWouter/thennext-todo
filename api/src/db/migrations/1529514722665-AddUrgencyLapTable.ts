import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUrgencyLapTable1529514722665 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `UrgencyLap` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(255) NOT NULL UNIQUE, `fromDay` decimal(7,3) NOT NULL, `urgencyModifier` decimal(7,3) NOT NULL, `ownerId` int(11)) ENGINE=InnoDB;");
        await queryRunner.query("ALTER TABLE `UrgencyLap` ADD CONSTRAINT `fk_ded2ab4d6465d27ff1850e28a73` FOREIGN KEY (`ownerId`) REFERENCES `Account`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `UrgencyLap` DROP FOREIGN KEY `fk_ded2ab4d6465d27ff1850e28a73`");
        await queryRunner.query("DROP TABLE `UrgencyLap`");
    }

}
