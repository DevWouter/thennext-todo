import { injectable, inject } from "inversify";
import * as bcrypt from "bcryptjs";
import * as moment from "moment";

import { SessionEntity } from "../db/entities";
import { AccountRepository } from "../repositories/account-repository";
import { Database } from "./database";

@injectable()
export class SessionRepository {
    constructor(
        @inject("Database") private readonly database: () => Promise<Database>,
        private readonly accountService: AccountRepository,
    ) { }

    async byToken(token: string): Promise<SessionEntity | null> {
        const db = await this.database();
        const { results } = await db.execute("SELECT * FROM `Session` WHERE `token` = ?", [token]);
        if (results.length === 0) {
            return null;
        }

        return this.clone(results[0]);
    }

    async create(email: string, password: string): Promise<SessionEntity> {
        throw new Error("Not yet implemented");
        // const account = await this.accountService.byEmail(email);
        // if (!account) {
        //     throw new Error("No user found");
        // }

        // const validPassword = await bcrypt.compare(password, account.password_hash);
        // if (!validPassword) {
        //     throw new Error("Password is invalid");
        // }

        // const session = new SessionEntity();
        // session.account = account;
        // session.token = await bcrypt.genSalt();
        // session.expire_on = moment().add({ weeks: 3 }).toDate();
        // session.created_on = moment().toDate();

        // return (await this.db()).createEntityManager().save(session);
    }

    async extend(token: string): Promise<SessionEntity> {
        const db = await this.database();
        const session = this.byToken(token);
        if (session === null) {
            throw new Error(`Session with token ${token} does not exist`);
        }

        const newExpireDate = moment().add({ weeks: 3 }).toDate();
        const { results } = await db.execute("UPDATE `Session` SET `expire_on` = ? WHERE `token` = ?", [newExpireDate, token]);
        if (results.affectedRows === 0) {
            throw new Error(`No session was set a new expire date`);
        }

        return this.byToken(token);
    }

    async destroy(session: SessionEntity): Promise<SessionEntity> {
        throw new Error("Not yet implemented");
        // const entityManager = (await this.db()).createEntityManager();
        // return entityManager.remove(session);
    }

    private clone(src: SessionEntity): SessionEntity {
        return {
            id: src.id,
            accountId: src.accountId,
            token: src.token,
            created_on: src.created_on,
            expire_on: src.expire_on,
        }
    }
}
