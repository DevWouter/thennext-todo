import { injectable, inject } from "inversify";
import { Request } from "express";
import { AccountEntity, AccountSettingsEntity } from "../db/entities";
import { Connection } from "typeorm";

@injectable()
export class AccountSettingsService {

    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) { }

    async byId(id: number): Promise<AccountSettingsEntity> {
        return (await this.db())
            .createQueryBuilder(AccountSettingsEntity, "accountSettings")
            .innerJoinAndSelect("accountSettings.primaryList", "primaryList")
            .where("accountSettings.id = :id", { id: id })
            .getOne();
    }

    async of(account: AccountEntity): Promise<AccountSettingsEntity> {
        return (await this.db())
            .createQueryBuilder(AccountSettingsEntity, "accountSettings")
            .innerJoin("accountSettings.account", "account")
            .innerJoinAndSelect("accountSettings.primaryList", "primaryList")
            .where("account.id = :id", { id: account.id })
            .getOne();
    }

    async update(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(AccountSettingsEntity, entity);
    }

    async create(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(entity);
    }
    async destroy(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(AccountSettingsEntity, entity);
    }
}
