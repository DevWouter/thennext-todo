import { injectable } from "inversify";
import { Connection } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as moment from "moment";

import { AccountService } from "./account-service";

import { SessionEntity } from "../db/entities";
import { Session } from "../route/session/session.model";

@injectable()
export class SessionService {
    constructor(
        private readonly db: Connection,
        private readonly accountService: AccountService,
    ) { }

    async byToken(token: string): Promise<SessionEntity> {
        return this.db
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

        return this.db.createEntityManager().save(session);
    }

    async extend(token: string): Promise<SessionEntity> {
        const session = await this.byToken(token);

        session.expire_on = moment().add({ weeks: 3 }).toDate();

        return this.db.createEntityManager().save(session);
    }

    destroy(session: SessionEntity): Promise<SessionEntity> {
        const entityManager = this.db.createEntityManager();
        return entityManager.remove(session);
    }
}