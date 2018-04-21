import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { AccountEntity } from "../../db/entities";
import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";
import { getAccount } from "../../server/get-account";


export async function TaskListList(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const token = authService.getAuthenticationToken(req);
    const account = await getAccount(token);

    const src = await getConnection()
        .createQueryBuilder(AccountEntity, "account")
        .leftJoinAndSelect("account.taskLists", "taskList")
        .leftJoinAndSelect("taskList.owner", "owner")
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
