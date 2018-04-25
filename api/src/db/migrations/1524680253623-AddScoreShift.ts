import {MigrationInterface, QueryRunner} from "typeorm";

export class AddScoreShift1524680253623 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `ScoreShift` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `uuid` varchar(255) NOT NULL UNIQUE, `phrase` varchar(255) NOT NULL, `score` int(11) NOT NULL DEFAULT 0, `created_on` datetime NOT NULL, `updated_on` datetime NOT NULL, `ownerId` int(11)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `ScoreShift` ADD CONSTRAINT `fk_73e1f703e12617d4e7992558b6f` FOREIGN KEY (`ownerId`) REFERENCES `Account`(`id`) ON DELETE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ScoreShift` DROP FOREIGN KEY `fk_73e1f703e12617d4e7992558b6f`");
        await queryRunner.query("DROP TABLE `ScoreShift`");
    }

}
