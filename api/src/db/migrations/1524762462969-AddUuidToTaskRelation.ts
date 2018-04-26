import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUuidToTaskRelation1524762462969 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`TaskRelation` ADD `uuid` varchar(255) NOT NULL UNIQUE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`TaskRelation` DROP `uuid`");
    }

}
