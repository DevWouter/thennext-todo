import { Request, Response } from "express";
import { getConnection } from "typeorm";

import * as bcrypt from "bcryptjs";
import * as moment from "moment";

import { Account } from "../../models";

import { AccountEntity, AccountSettingsEntity, TaskListEntity, SessionEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import { Session } from "./session.model";
import { getAccount } from "../../server/get-account";
import { getAuthorizationToken } from "../../server/get-authorization-token";

export async function SessionDestroy(req: Request, res: Response): Promise<void> {
    const entityManager = getConnection().createEntityManager();
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

    const query = entityManager
        .createQueryBuilder(SessionEntity, "session")
        .innerJoin("session.account", "account")
        .where("account.id = :id", { id: account.id })
        .andWhere("session.token = :token", { token: token });

    const session = await query.getOne();

    await entityManager.deleteById(SessionEntity, session.id);

    // Tell the client the session was deleted.
    res.sendStatus(200);
}