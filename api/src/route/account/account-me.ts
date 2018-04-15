import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { Account } from "../../models";

import { AccountEntity, DecaySpeedEntity } from "../../db/entities";

import { TransformAccount } from "./helpers/account-to-model";
import { getAuthorizationToken } from "../../server/get-authorization-token";
import { getAccount } from "../../server/get-account";

export async function AccountMe(req: Request, res: Response): Promise<void> {
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

    const src = await getConnection()
        .createQueryBuilder(AccountEntity, "account")
        .innerJoinAndSelect("account.accountSettings", "accountSettings")
        .leftJoinAndSelect("account.decaySpeeds", "decaySpeeds")
        .leftJoinAndSelect("account.tagScores", "tagScores")
        .where("account.id = :id", { id: account.id })
        .getOne();

    res.send({
        uuid: src.uuid,
        email: src.email,
        accountSettings: {
            scrollToNewTasks: src.accountSettings.scrollToNewTasks,
            hideScoreInTaskList: src.accountSettings.hideScoreInTaskList,
            defaultWaitUntil: src.accountSettings.defaultWaitUntil,
            urgencyPerDay: src.accountSettings.urgencyPerDay,
            urgencyWhenActive: src.accountSettings.urgencyWhenActive,
            urgencyWhenDescription: src.accountSettings.urgencyWhenDescription,
            urgencyWhenBlocking: src.accountSettings.urgencyWhenBlocking,
            urgencyWhenBlocked: src.accountSettings.urgencyWhenBlocked,

            decaySpeeds: src.decaySpeeds.map(x => ({ from: x.from, coefficient: x.coefficient })),
            tagScores: src.tagScores.map(x => ({ name: x.name, value: x.value })),
        }
    });
}
