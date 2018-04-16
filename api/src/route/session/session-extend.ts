import { Request, Response } from "express";
import { getConnection } from "typeorm";

import * as moment from "moment";
import * as bcrypt from "bcryptjs";

import { Account } from "../../models";

import { AccountEntity, AccountSettingsEntity, TaskListEntity, SessionEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import { Session } from "./session.model";
import { getAccount } from "../../server/get-account";
import { getAuthorizationToken } from "../../server/get-authorization-token";

export async function SessionExtend(req: Request, res: Response): Promise<void> {
    const entityManager = getConnection().createEntityManager();
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

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
