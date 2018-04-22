import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";

import { AccountEntity } from "../../db/entities";
import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";

import { AccountService } from "../../services/account-service";
import { TaskListService } from "../../services/task-list-service";


export async function TaskListList(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskListService = container.resolve(TaskListService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const src = await taskListService.of(account);

    const dst = src.map(x => ({
        uuid: x.uuid,
        name: x.name,
        ownerUuid: x.owner.uuid,
        primary: x.primary,
    }));

    res.send(dst);
}
