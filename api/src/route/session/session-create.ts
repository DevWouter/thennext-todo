import { Request, Response } from "express";
import { getConnection } from "typeorm";

import * as bcrypt from "bcryptjs";
import { Account } from "../../models";

import { AccountEntity, AccountSettingsEntity, TaskListEntity, SessionEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import { Session } from "./session.model";
import * as moment from "moment";

export interface SessionCreateInput {
    readonly email: string;
    readonly password: string;
}

export async function SessionCreate(req: Request, res: Response): Promise<void> {
    const input = req.body as SessionCreateInput;
    const entityManager = getConnection().createEntityManager();
    const account = await entityManager.findOne(AccountEntity, <Partial<AccountEntity>>{ email: input.email });
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