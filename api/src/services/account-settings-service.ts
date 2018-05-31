import { injectable } from "inversify";
import { Request } from "express";
import { AccountEntity, AccountSettingsEntity } from "../db/entities";
import { Connection } from "typeorm";

@injectable()
export class AccountSettingsService {

    constructor(
        private readonly db: Connection
    ) { }

    byId(id: number): Promise<AccountSettingsEntity> {
        return this.db
            .createQueryBuilder(AccountSettingsEntity, "accountSettings")
            .innerJoinAndSelect("accountSettings.primaryList", "primaryList")
            .where("accountSettings.id = :id", { id: id })
            .getOne();
    }

    of(account: AccountEntity): Promise<AccountSettingsEntity> {
        return this.db
            .createQueryBuilder(AccountSettingsEntity, "accountSettings")
            .innerJoin("accountSettings.account", "account")
            .innerJoinAndSelect("accountSettings.primaryList", "primaryList")
            .where("account.id = :id", { id: account.id })
            .getOne();
    }

    update(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(AccountSettingsEntity, entity);
    }

    create(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(entity);
    }
    destroy(entity: AccountSettingsEntity): Promise<AccountSettingsEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(AccountSettingsEntity, entity);
    }
}
