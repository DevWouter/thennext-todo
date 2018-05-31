import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { TaskList } from "./task-list.model";
import { TaskListEntity } from "../../db/entities";
import { TaskListRightEntity, AccessRight } from "../../db/entities/task-list-right.entity";

import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";
import { TaskListService } from "../../services/task-list-service";
import { AccountSettingsService } from "../../services/account-settings-service";
import { TaskListRightService } from "../../services/task-list-right-service";

export interface TaskListInput {
    readonly name: string;
}

export async function taskListCreate(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskListService = container.resolve(TaskListService);
    const taskListRightService = container.resolve(TaskListRightService);
    const accountSettingsService = container.resolve(AccountSettingsService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const accountSettings = await accountSettingsService.of(account);

    const input = req.body as TaskListInput;

    const taskList = new TaskListEntity();
    taskList.name = input.name;
    taskList.owner = account;

    const savePromise = taskListService.create(taskList);
    // Also create the right
    savePromise.catch(console.error);

    const dst = await savePromise;

    const ownerRight = new TaskListRightEntity();
    ownerRight.access = AccessRight.owner;
    ownerRight.account = account;
    ownerRight.taskList = dst;
    await taskListRightService.create(ownerRight);

    res.send({
        name: dst.name,
        uuid: dst.uuid,
        primary: dst.id === accountSettings.primaryList.id, // TO BE REMOVED
        ownerUuid: account.uuid,
    });
}
