import { injectable, inject } from "inversify";
import * as moment from "moment";

import { Database, uuidv4 } from "./database";

import { PasswordRecoveryTokenEntity, AccountEntity } from "../db/entities";

@injectable()
export class PasswordRecoveryTokenRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    private async byId(id: number): Promise<PasswordRecoveryTokenEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                " SELECT `PasswordRecoveryToken`.*",
                " FROM `PasswordRecoveryToken`",
                " WHERE `PasswordRecoveryToken`.`id` = ? ",
                " LIMIT 1"
            ],
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async byTokenAndEmail(token: string, email: string): Promise<PasswordRecoveryTokenEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                " SELECT `PasswordRecoveryToken`.*",
                " FROM `PasswordRecoveryToken`",
                " INNER JOIN `Account` ON `Account`.`id`=`PasswordRecoveryToken`.`accountId`",
                " WHERE `PasswordRecoveryToken`.`token` = ? ",
                " AND `Account`.`email` = ? ",
                " LIMIT 1"
            ],
            [token, email]
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
    async create(account: AccountEntity): Promise<PasswordRecoveryTokenEntity> {
        const db = await this.database();
        const id = await db.insert<PasswordRecoveryTokenEntity>("PasswordRecoveryToken", {
            accountId: account.id,
            createdAt: new Date(),
            validUntil: moment().add({ hours: 1 }).toDate(),
            token: uuidv4()
        });

        return this.byId(id);
    }

    async destroy(entity: PasswordRecoveryTokenEntity): Promise<void> {
        const db = await this.database();
        await db.delete<PasswordRecoveryTokenEntity>("PasswordRecoveryToken", { id: entity.id }, 1);
    }

    async deleteExpiredTokens(): Promise<number> {
        const db = await this.database();

        const { results } = await db.execute([
            "DELETE FROM `PasswordRecoveryToken`",
            "WHERE `validUntil` < NOW()"
        ]);

        return results.affectedRows;
    }

    private clone(src: PasswordRecoveryTokenEntity): PasswordRecoveryTokenEntity {
        return {
            id: src.id,
            accountId: src.accountId,
            token: src.token,
            createdAt: src.createdAt,
            validUntil: src.validUntil,
        };
    }
}
