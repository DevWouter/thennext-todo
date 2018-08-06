import { injectable, inject } from "inversify";
import { AccountEntity, AccountSettingsEntity } from "../db/entities";
import { Database } from "./database";

@injectable()
export class AccountSettingsRepository {

    constructor(
        @inject("Database") private readonly database: () => Promise<Database>
    ) { }

    async byId(id: number): Promise<AccountSettingsEntity> {
        throw new Error("Not yet implemented");
        // return (await this.db())
        //     .createQueryBuilder(AccountSettingsEntity, "accountSettings")
        //     .innerJoinAndSelect("accountSettings.primaryList", "primaryList")
        //     .where("accountSettings.id = :id", { id: id })
        //     .getOne();
    }

    async of(account: AccountEntity): Promise<AccountSettingsEntity> {
        const db = await this.database();
        const { results } = await db.execute("SELECT `AccountSettings`.* FROM `AccountSettings`" +
            " WHERE `AccountSettings`.`accountId` = ?" +
            " LIMIT 1"
            , [account.id]);

        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
        // return (await this.db())
        //     .createQueryBuilder(AccountSettingsEntity, "accountSettings")
        //     .innerJoin("accountSettings.account", "account")
        //     .innerJoinAndSelect("accountSettings.primaryList", "primaryList")
        //     .where("account.id = :id", { id: account.id })
        //     .getOne();
    }

    async update(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(AccountSettingsEntity, entity);
    }

    async create(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.save(entity);
    }
    async destroy(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(AccountSettingsEntity, entity);
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
