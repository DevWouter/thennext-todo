import { injectable } from "inversify";
import { Request } from "express";
import { AccountEntity } from "../db/entities";
import { Connection } from "typeorm";

@injectable()
export class AccountService {

    constructor(
        private readonly db: Connection
    ) { }

    byToken(token: string): Promise<AccountEntity> {
        return this.db
            .createQueryBuilder(AccountEntity, "account")
            .innerJoin("account.sessions", "session", "session.token = :token", { token })
            .getOne();
    }

    byEmail(email: string): Promise<AccountEntity> {
        return this.db
            .createQueryBuilder(AccountEntity, "account")
            .where("account.email = :email", { email: email })
            .getOne();
    }

    update(entity: AccountEntity): Promise<AccountEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(AccountEntity, entity);
    }

    create(entity: AccountEntity): Promise<AccountEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.save(entity);
    }
    destroy(entity: AccountEntity): Promise<AccountEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(AccountEntity, entity);
    }
}
