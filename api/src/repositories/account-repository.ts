import { injectable, inject } from "inversify";
import { Request } from "express";
import { AccountEntity } from "../db/entities";
import { Connection } from "typeorm";

@injectable()
export class AccountRepository {

    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>
    ) {
    }

    async byToken(token: string): Promise<AccountEntity> {
        return (await this.db())
            .createQueryBuilder(AccountEntity, "account")
            .innerJoin("account.sessions", "session", "session.token = :token", { token })
            .getOne();
    }

    async byEmail(email: string): Promise<AccountEntity> {
        return (await this.db())
            .createQueryBuilder(AccountEntity, "account")
            .where("account.email = :email", { email: email })
            .getOne();
    }

    async byId(id: number): Promise<AccountEntity> {
        return (await this.db())
            .createQueryBuilder(AccountEntity, "account")
            .where("account.id = :id")
            .setParameters({ id: id })
            .getOne();
    }

    async update(entity: AccountEntity): Promise<AccountEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(AccountEntity, entity);
    }

    async create(entity: AccountEntity): Promise<AccountEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.save(entity);
    }
    async destroy(entity: AccountEntity): Promise<AccountEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(AccountEntity, entity);
    }
}
