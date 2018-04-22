import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { TaskList } from "./task-list.model";
import { TaskListEntity } from "../../db/entities";


import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskListService } from "../../services/task-list-service";

export interface TaskListInput {
    readonly name: string;
}

export async function TaskListDelete(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskListService = container.resolve(TaskListService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const taskList = await taskListService.byUuid(req.params.uuid, account);
    if (taskList.primary) {
        throw new Error(`Primary TaskList can not be deleted (uuid: ${taskList.uuid}`);
    }
    await taskListService.destroy(taskList);

    res.send({});
}
