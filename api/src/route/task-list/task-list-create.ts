import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { TaskList } from "./task-list.model";
import { TaskListEntity } from "../../db/entities";


import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";
import { TaskListService } from "../../services/task-list-service";

export interface TaskListInput {
    readonly name: string;
}

export async function taskListCreate(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskListService = container.resolve(TaskListService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const input = req.body as TaskListInput;

    const taskList = new TaskListEntity();
    taskList.name = input.name;
    taskList.owner = account;

    const savePromise = taskListService.create(taskList);
    savePromise.catch(console.error);

    const dst = await savePromise;

    res.send({
        name: dst.name,
        uuid: dst.uuid,
        primary: dst.primary,
        ownerUuid: account.uuid,
    });
}
