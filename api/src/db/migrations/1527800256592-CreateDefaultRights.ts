import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDefaultRights1527800256592 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            "INSERT INTO `TaskListRight` (`uuid`, `access`, `taskListId`, `accountId`) " +
            "SELECT " +
            "UUID() AS `uuid`, " +
            "'owner' AS `access`, " +
            "`id` AS `taskListId`, " +
            "`ownerId` AS  `accountId` " +
            "FROM `TaskList`");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
