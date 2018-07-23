import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCascadeDeleteToTasklistRight1532370628856 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `TaskListRight` DROP FOREIGN KEY `fk_5c413e440d3840d1ff19304204a`");
        await queryRunner.query("ALTER TABLE `TaskListRight` ADD CONSTRAINT `fk_5c413e440d3840d1ff19304204a` FOREIGN KEY (`taskListId`) REFERENCES `TaskList`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `TaskListRight` DROP FOREIGN KEY `fk_5c413e440d3840d1ff19304204a`");
        await queryRunner.query("ALTER TABLE `TaskListRight` ADD CONSTRAINT `fk_5c413e440d3840d1ff19304204a` FOREIGN KEY (`taskListId`) REFERENCES `TaskList`(`id`)");
    }

}
