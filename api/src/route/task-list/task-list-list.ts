import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";

import { AccountEntity } from "../../db/entities";
import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";

import { AccountService } from "../../services/account-service";
import { TaskListService } from "../../services/task-list-service";
import { AccountSettingsService } from "../../services/account-settings-service";


export async function TaskListList(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskListService = container.resolve(TaskListService);
    const accountSettingsService = container.resolve(AccountSettingsService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const accountSettings = await accountSettingsService.of(account);

    const src = await taskListService.of(account);

    const dst = src.map(x => ({
        uuid: x.uuid,
        name: x.name,
        primary: x.id === accountSettings.primaryList.id, // TO BE REMOVED
    }));

    res.send(dst);
}
