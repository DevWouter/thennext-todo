import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeCompletedAtNullable1524079619620 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Task` CHANGE `completedAt` `completedAt` datetime");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Task` CHANGE `completedAt` `completedAt` datetime NOT NULL");
    }

}
