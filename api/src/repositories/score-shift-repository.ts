import { injectable, inject } from "inversify";


import { AccountEntity, ScoreShiftEntity } from "../db/entities";
import { Database } from "./database";

@injectable()
export class ScoreShiftRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // return (await this.db())
        //     .createQueryBuilder(ScoreShiftEntity, "scoreShift")
        //     .innerJoinAndSelect("scoreShift.owner", "account")
        //     .where("scoreShift.uuid = :uuid", { uuid: uuid })
        //     .andWhere("account.id = :id", { id: account.id })
        //     .getOne();
    }

    async byId(id: number): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // return (await this.db())
        //     .createQueryBuilder(ScoreShiftEntity, "scoreShift")
        //     .where("scoreShift.id = :id", { id: id })
        //     .getOne();
    }

    async of(account: AccountEntity): Promise<ScoreShiftEntity[]> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `ScoreShift`.* FROM `ScoreShift`",
                "WHERE `ScoreShift`.`ownerId` = ?",
            ]
            ,
            [account.id]
        );

        const result: ScoreShiftEntity[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            result.push(this.clone(element));
        }

        return result;
    }

    async update(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(ScoreShiftEntity, entity);
    }

    async create(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(ScoreShiftEntity, entity);
    }

    async destroy(entity: ScoreShiftEntity): Promise<ScoreShiftEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(ScoreShiftEntity, entity);
    }

    private clone(src: ScoreShiftEntity): ScoreShiftEntity {
        return {
            created_on: src.created_on,
            id: src.id,
            ownerId: src.ownerId,
            phrase: src.phrase,
            score: src.score,
            updated_on: src.updated_on,
            uuid: src.uuid,
        }
    }
}
