import { injectable, inject } from "inversify";


import { AccountEntity, ScoreShiftEntity } from "../db/entities";
import { Database, uuidv4 } from "./database";

@injectable()
export class ScoreShiftRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byUuid(uuid: string, account: AccountEntity): Promise<ScoreShiftEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `ScoreShift`.* FROM `ScoreShift`",
                "WHERE 1=1",
                "AND `ScoreShift`.`ownerId` = ?",
                "AND `ScoreShift`.`uuid` = ?",
            ],
            [account.id, uuid]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async byId(id: number): Promise<ScoreShiftEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `ScoreShift`.* FROM `ScoreShift`",
                "WHERE `ScoreShift`.`id` = ?",
            ],
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
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

    async create(account: AccountEntity, phrase: string, score: number): Promise<ScoreShiftEntity> {
        const db = await this.database();
        const id = await db.insert<ScoreShiftEntity>("ScoreShift", {
            phrase: phrase,
            score: score,
            ownerId: account.id,
            uuid: uuidv4(),

            created_on: new Date(),
            updated_on: new Date(),
        });

        return this.byId(id);
    }

    async destroy(entity: ScoreShiftEntity): Promise<void> {
        const db = await this.database();
        await db.delete<ScoreShiftEntity>("ScoreShift", { id: entity.id }, 1);
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
