import { injectable, inject } from "inversify";
import { AccountEntity, AccountSettingsEntity, TaskListEntity } from "../db/entities";
import { Database } from "./database";

@injectable()
export class AccountSettingsRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byId(id: number): Promise<AccountSettingsEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `AccountSettings`.* FROM `AccountSettings`",
                "WHERE `AccountSettings`.`id` = ?",
                "LIMIT 1"
            ],
            [id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async of(account: AccountEntity): Promise<AccountSettingsEntity> {
        const db = await this.database();
        const { results } = await db.execute(
            [
                "SELECT `AccountSettings`.* FROM `AccountSettings`",
                "WHERE `AccountSettings`.`accountId` = ?",
                "LIMIT 1"
            ],
            [account.id]
        );

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async create(account: AccountEntity, primaryTaskList: TaskListEntity): Promise<AccountSettingsEntity> {
        const db = await this.database();
        const id = await db.insert<AccountSettingsEntity>("AccountSettings", {
            accountId: account.id,
            primaryListId: primaryTaskList.id,
        });

        return this.byId(id);
    }

    private clone(src: AccountSettingsEntity): AccountSettingsEntity {
        return {
            accountId: src.accountId,
            id: src.id,
            primaryListId: src.primaryListId,
        };
    }
}
