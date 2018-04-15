import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { Account } from "../../models";

import { AccountEntity } from "../../db/entities";
import { getAuthorizationToken } from "../../server/get-authorization-token";
import { getAccount } from "../../server/get-account";


export async function TaskListList(req: Request, res: Response): Promise<void> {
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

    const src = await getConnection()
        .createQueryBuilder(AccountEntity, "account")
        .leftJoinAndSelect("account.taskLists", "taskList")
        .innerJoinAndSelect("taskList.owner", "owner")
        .where("account.id = :id", { id: account.id })
        .getOne();


    const dst = src.taskLists.map(x => ({
        uuid: x.uuid,
        name: x.name,
        ownerUuid: x.owner.uuid,
        primary: x.primary,
    }));

    res.send(dst);
}
