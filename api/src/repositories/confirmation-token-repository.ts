import { injectable, inject } from "inversify";
import * as moment from "moment";

import { Database, uuidv4 } from "./database";

import { ConfirmationTokenEntity, AccountEntity } from "../db/entities";

@injectable()
export class ConfirmationTokenRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byId(id: number): Promise<ConfirmationTokenEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                " SELECT `ConfirmationToken`.*,",
                " FROM `ConfirmationToken`",
                " WHERE `ConfirmationToken`.`id` = ? ",
                " LIMIT 1"
            ],
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async byToken(token: number): Promise<ConfirmationTokenEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                " SELECT `ConfirmationToken`.*,",
                " FROM `ConfirmationToken`",
                " WHERE `ConfirmationToken`.`token` = ? ",
                " LIMIT 1"
            ],
            [token]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    /**
     * Creates and stores a confirmation token in the database.
     * @param account The account for which the confirmation token needs to be generated.
     */
    async create(account: AccountEntity): Promise<ConfirmationTokenEntity> {
        const db = await this.database();
        const id = await db.insert<ConfirmationTokenEntity>("ConfirmationToken", {
            accountId: account.id,
            createdAt: new Date(),
            validUntil: moment().add({ weeks: 3 }).toDate(),
            token: uuidv4()
        });

        return this.byId(id);
    }

    async destroy(entity: ConfirmationTokenEntity): Promise<void> {
        const db = await this.database();
        await db.delete<ConfirmationTokenEntity>("ConfirmationToken", { id: entity.id }, 1);
    }

    private clone(src: ConfirmationTokenEntity): ConfirmationTokenEntity {
        return {
            id: src.id,
            accountId: src.accountId,
            token: src.token,
            createdAt: src.createdAt,
            validUntil: src.validUntil,
        };
    }
}
