import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSleepUntilToTask1524928257906 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Task` ADD `sleepUntil` datetime");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Task` DROP `sleepUntil`");
    }

}
