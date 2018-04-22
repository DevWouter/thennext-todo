import { Request, Response } from "express";
import { getConnection } from "typeorm";

import * as moment from "moment";
import * as bcrypt from "bcryptjs";

import { AccountEntity, AccountSettingsEntity, TaskListEntity, SessionEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import { Session } from "./session.model";

import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";


export async function SessionExtend(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entityManager = getConnection().createEntityManager();

    const query = entityManager
        .createQueryBuilder(SessionEntity, "session")
        .innerJoin("session.account", "account")
        .where("account.id = :id", { id: account.id })
        .andWhere("session.token = :token", { token: token });

    const session = await query.getOne();
    const newExpireDate = moment().add({ weeks: 3 }).toDate();

    await entityManager.update(SessionEntity, session, { expire_on: newExpireDate });
    const updatedSession = await entityManager.preload(SessionEntity, session);

    // Tell the client the session was deleted.
    const result = <Session>{
        expireAt: session.expire_on,
        token: session.token,
    };

    res.send(result);
}
