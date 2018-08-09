import { injectable, inject } from "inversify";
import { UrgencyLapEntity } from "../db/entities/urgency-lap.entity";
import { AccountEntity } from "../db/entities/account.entity";
import { Connection } from "mysql";
import { Database, uuidv4 } from "./database";

@injectable()
export class UrgencyLapRepository {
    private readonly db: Promise<Connection>;
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) {
    }

    async byId(id: number): Promise<UrgencyLapEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `UrgencyLap`.* FROM `UrgencyLap`",
                "WHERE `UrgencyLap`.`id` = ?",
                "LIMIT 1"
            ],
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async byUuid(uuid: string, account: AccountEntity): Promise<UrgencyLapEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `UrgencyLap`.* FROM `UrgencyLap`",
                "WHERE `UrgencyLap`.`uuid` = ?",
                "  AND `UrgencyLap`.`ownerId` = ?",
                "LIMIT 1"
            ],
            [uuid, account.id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async of(account: AccountEntity): Promise<UrgencyLapEntity[]> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `UrgencyLap`.* FROM `UrgencyLap`",
                "WHERE `UrgencyLap`.`ownerId` = ?"
            ]
            , [account.id]);

        const result: UrgencyLapEntity[] = [];
        for (let index = 0; index < results.length; index++) {
            const element = results[index];
            result.push(this.clone(element));
        }

        return result;
    }

    async create(account: AccountEntity, fromDay: number, score: number): Promise<UrgencyLapEntity> {
        const db = await this.database();
        const id = await db.insert<UrgencyLapEntity>("UrgencyLap", {
            uuid: uuidv4(),
            ownerId: account.id,
            fromDay: fromDay,
            urgencyModifier: score,
        });

        return this.byId(id);
    }

    async destroy(entity: UrgencyLapEntity): Promise<void> {
        const db = await this.database();
        await db.delete<UrgencyLapEntity>("UrgencyLap", { id: entity.id }, 1);
    }

    private clone(src: UrgencyLapEntity): UrgencyLapEntity {
        return {
            fromDay: src.fromDay,
            id: src.id,
            ownerId: src.ownerId,
            urgencyModifier: src.urgencyModifier,
            uuid: src.uuid,
        }
    }
}
