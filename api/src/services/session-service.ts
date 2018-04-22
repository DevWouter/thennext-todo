import { injectable } from "inversify";
import { Connection } from "typeorm";
import * as bcrypt from "bcryptjs";
import * as moment from "moment";

import { AccountService } from "./account-service";

import { SessionEntity } from "../db/entities";

@injectable()
export class SessionService {
    constructor(
        private readonly db: Connection,
        private readonly accountService: AccountService,
    ) { }

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
        const session = await this.db.createQueryBuilder()
            .select()
            .from(SessionEntity, "session")
            .where("session.token = :token", { token: token })
            .getOne();

        session.expire_on = moment().add({ weeks: 3 }).toDate();

        return this.db.createEntityManager().save(session);
    }

    async destroy(token: string): Promise<void> {
        return this.db.createQueryBuilder()
            .delete()
            .from(SessionEntity, "session")
            .where("session.token = :token", { token: token })
            .execute();
    }
}
