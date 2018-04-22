import { Request, Response } from "express";
import { getConnection } from "typeorm";

import * as bcrypt from "bcryptjs";
import * as moment from "moment";


import { AccountEntity, AccountSettingsEntity, TaskListEntity, SessionEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import { Session } from "./session.model";

import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";

export async function SessionDestroy(req: Request, res: Response): Promise<void> {
    const entityManager = getConnection().createEntityManager();

    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

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
