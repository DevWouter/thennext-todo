import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveSleepUntilFromTask1531761711625 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Task` DROP `sleepUntil`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Task` ADD `sleepUntil` datetime");
    }

}
