import { injectable, inject } from "inversify";
import { AccountEntity } from "../db/entities";
import { Database, uuidv4 } from "./database";



@injectable()
export class AccountRepository {

    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) {
    }

    async byToken(token: string): Promise<AccountEntity> {
        const db = await this.database();
        const { results, fields } = await db.execute(
            [
                "SELECT `Account`.* FROM `Account`",
                "INNER JOIN `Session` ON `Session`.`accountId`=`Account`.`id`",
                "WHERE `Session`.`token` = ?",
                "LIMIT 1 "
            ],
            [token]
        );

        if (results.length === 0) {
            // No results were found
            return null;
        }

        return this.clone(results[0]);
    }

    async byEmail(email: string): Promise<AccountEntity | null> {
        const db = await this.database();
        const { results } = await db.execute(
            "SELECT * FROM ?? WHERE ?? = ? LIMIT 1",
            ['Account', 'email', email]
        );

        if (results.length === 0) {
            // No results were found
            return null;
        }

        return this.clone(results[0]);
    }

    async byId(id: number): Promise<AccountEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            "SELECT * FROM ?? WHERE ?? = ? LIMIT 1",
            ['Account', 'id', id]
        );

        if (results.length === 0) {
            // No results were found
            return null;
        }

        return this.clone(results[0]);
    }

    async updatePassword(entity: AccountEntity): Promise<void> {
        const db = await this.database();
        await db.update<AccountEntity>("Account"
            , { // Update
                password_hash: entity.password_hash,
            }
            , { // Filter
                id: entity.id
            }
            , 1);
    }

    async update(entity: AccountEntity): Promise<void> {
        const db = await this.database();
        await db.update<AccountEntity>("Account"
            , { // Update
                displayName: entity.displayName,
                is_confirmed: entity.is_confirmed
            }
            , { // Filter
                id: entity.id
            }
            , 1);
    }

    async create(email: string, password_hash: string): Promise<AccountEntity> {
        const db = await this.database();
        const id = await db.insert<AccountEntity>("Account", {
            uuid: uuidv4(),
            email: email,
            displayName: email,
            password_hash: password_hash,
            is_confirmed: false,
        });

        return this.byId(id);
    }

    private clone(src: AccountEntity): AccountEntity {
        return {
            displayName: src.displayName,
            email: src.email,
            id: src.id,
            password_hash: src.password_hash,
            uuid: src.uuid,
            is_confirmed: src.is_confirmed,
        };
    }
}
