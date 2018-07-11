import { injectable, inject } from "inversify";
import { Connection } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as moment from "moment";

import { SessionEntity } from "../db/entities";
import { AccountRepository } from "../repositories/account-repository";

@injectable()
export class SessionRepository {
    constructor(
        @inject("ConnectionProvider") private readonly db: () => Promise<Connection>,
        private readonly accountService: AccountRepository,
    ) { }

    async byToken(token: string): Promise<SessionEntity> {
        return (await this.db())
            .createQueryBuilder(SessionEntity, "session")
            .where("session.token = :token", { token: token })
            .getOne();
    }

    async create(email: string, password: string): Promise<SessionEntity> {
        const account = await this.accountService.byEmail(email);
        if (!account) {
            throw new Error("No user found");
        }

        const validPassword = await bcrypt.compare(password, account.password_hash);
        if (!validPassword) {
            throw new Error("Password is invalid");
        }

        const session = new SessionEntity();
        session.account = account;
        session.token = await bcrypt.genSalt();
        session.expire_on = moment().add({ weeks: 3 }).toDate();
        session.created_on = moment().toDate();

        return (await this.db()).createEntityManager().save(session);
    }

    async extend(token: string): Promise<SessionEntity> {
        const session = await this.byToken(token);

        session.expire_on = moment().add({ weeks: 3 }).toDate();

        return (await this.db()).createEntityManager().save(session);
    }

    async destroy(session: SessionEntity): Promise<SessionEntity> {
        const entityManager = (await this.db()).createEntityManager();
        return entityManager.remove(session);
    }
}
