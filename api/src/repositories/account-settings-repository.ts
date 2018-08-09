import { injectable, inject } from "inversify";
import { AccountEntity, AccountSettingsEntity, TaskListEntity, DefaultAccountSettings } from "../db/entities";
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
            defaultWaitUntil: DefaultAccountSettings.defaultWaitUntil,
            hideScoreInTaskList: DefaultAccountSettings.hideScoreInTaskList,
            scrollToNewTasks: DefaultAccountSettings.scrollToNewTasks,
            urgencyPerDay: DefaultAccountSettings.urgencyPerDay,
            urgencyWhenActive: DefaultAccountSettings.urgencyWhenActive,
            urgencyWhenBlocked: DefaultAccountSettings.urgencyWhenBlocked,
            urgencyWhenBlocking: DefaultAccountSettings.urgencyWhenBlocking,
            urgencyWhenDescription: DefaultAccountSettings.urgencyWhenDescription,
        });

        return this.byId(id);
    }

    private clone(src: AccountSettingsEntity): AccountSettingsEntity {
        return {
            accountId: src.accountId,
            defaultWaitUntil: src.defaultWaitUntil,
            hideScoreInTaskList: src.hideScoreInTaskList,
            id: src.id,
            primaryListId: src.primaryListId,
            scrollToNewTasks: src.scrollToNewTasks,
            urgencyPerDay: src.urgencyPerDay,
            urgencyWhenActive: src.urgencyWhenActive,
            urgencyWhenBlocked: src.urgencyWhenBlocked,
            urgencyWhenBlocking: src.urgencyWhenBlocking,
            urgencyWhenDescription: src.urgencyWhenDescription
        };
    }
}
