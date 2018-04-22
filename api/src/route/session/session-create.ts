import { Request, Response } from "express";
import { getConnection } from "typeorm";

import * as bcrypt from "bcryptjs";

import { AccountEntity, AccountSettingsEntity, TaskListEntity, SessionEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import { Session } from "./session.model";
import * as moment from "moment";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";

export interface SessionCreateInput {
    readonly email: string;
    readonly password: string;
}

export async function SessionCreate(req: Request, res: Response): Promise<void> {
    const input = req.body as SessionCreateInput;

    const accountService = container.resolve(AccountService);

    const entityManager = getConnection().createEntityManager();
    const account = await accountService.byEmail(input.email);
    if (!account) {
        throw new Error("No user found");
    }


    const validPassword = await bcrypt.compare(input.password, account.password_hash);
    if (!validPassword) {
        throw new Error("Password is invalid");
    }

    // Create the session and store it.
    let session = entityManager.create(SessionEntity);
    session.account = account;
    session.token = await bcrypt.genSalt();
    session.expire_on = moment().add({ weeks: 3 }).toDate();
    session.created_on = moment().toDate();

    session = await entityManager.save(session);

    const result = <Session>{
        token: session.token,
        expireAt: session.expire_on,
    };

    res.send(result);
}
