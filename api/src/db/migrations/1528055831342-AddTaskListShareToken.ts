import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTaskListShareToken1528055831342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `TaskListShareToken` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(255) NOT NULL UNIQUE, `token` varchar(255) NOT NULL, `taskListId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `TaskListShareToken` ADD CONSTRAINT `fk_ebbba0a522a6a7b7027416e0666` FOREIGN KEY (`taskListId`) REFERENCES `TaskList`(`id`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `TaskListShareToken` DROP FOREIGN KEY `fk_ebbba0a522a6a7b7027416e0666`");
        await queryRunner.query("DROP TABLE `TaskListShareToken`");
    }

}
