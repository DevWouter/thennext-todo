import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";

import { Account } from "./account.model";

import { AccountEntity, DecaySpeedEntity } from "../../db/entities";

import { TransformAccount } from "./helpers/account-to-model";
import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";

export async function AccountMe(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

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
