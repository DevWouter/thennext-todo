import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDisplayNameToAccount1528918903386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Account` ADD `displayName` varchar(120) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Account` DROP `displayName`");
    }

}
