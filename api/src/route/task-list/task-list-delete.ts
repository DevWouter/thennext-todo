import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { TaskList } from "./task-list.model";
import { TaskListEntity } from "../../db/entities";


import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { AccountSettingsService } from "../../services/account-settings-service";
import { TaskListService } from "../../services/task-list-service";

export interface TaskListInput {
    readonly name: string;
}

export async function TaskListDelete(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const accountSettingsService = container.resolve(AccountSettingsService);
    const taskListService = container.resolve(TaskListService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const accountSettings = await accountSettingsService.of(account);

    const taskList = await taskListService.byUuid(req.params.uuid, account);
    const ownership = await taskListService.hasOwnership(account, taskList);
    if (taskList.id === accountSettings.primaryList.id) {
        throw new Error(`Primary TaskList can not be deleted (uuid: ${taskList.uuid})`);
    }

    if (!ownership) {
        throw new Error(`You are not the owner of TaskList ${taskList.uuid}`);
    }

    await taskListService.destroy(taskList);

    res.send({});
}
