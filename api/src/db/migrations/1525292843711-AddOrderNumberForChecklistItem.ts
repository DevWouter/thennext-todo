import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOrderNumberForChecklistItem1525292843711 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`ChecklistItem` ADD `order` int(11) NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `test`.`Task` ADD `nextChecklistOrder` int(11) NOT NULL DEFAULT 1");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `test`.`Task` DROP `nextChecklistOrder`");
        await queryRunner.query("ALTER TABLE `test`.`ChecklistItem` DROP `order`");
    }

}
