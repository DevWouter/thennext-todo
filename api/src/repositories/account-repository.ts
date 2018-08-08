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

    async update(entity: AccountEntity): Promise<AccountEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(AccountEntity, entity);
    }

    async create(email: string, password_hash: string): Promise<AccountEntity> {
        const db = await this.database();
        const id = await db.insert<AccountEntity>("Account", {
            uuid: uuidv4(),
            email: email,
            displayName: email,
            password_hash: password_hash
        });

        return this.byId(id);
    }

    private clone(src: AccountEntity): AccountEntity {
        return {
            displayName: src.displayName,
            email: src.email,
            id: src.id,
            password_hash: src.password_hash,
            uuid: src.uuid
        };
    }
}
