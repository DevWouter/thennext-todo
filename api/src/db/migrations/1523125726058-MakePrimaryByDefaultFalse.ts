import {MigrationInterface, QueryRunner} from "typeorm";

export class MakePrimaryByDefaultFalse1523125726058 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`TaskList` CHANGE `primary` `primary` tinyint(4) NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`TaskList` CHANGE `primary` `primary` tinyint(4) NOT NULL");
    }

}
