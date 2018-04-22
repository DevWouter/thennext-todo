import { Request, Response } from "express";

import container from "../../inversify.config";

import { ChecklistItem } from "./checklist-item.model";
import { ChecklistItemEntity } from "../../db/entities";

import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { ChecklistItemService } from "../../services/checklist-item-service";
import { TaskService } from "../../services/task-service";

export async function ChecklistItemCreate(req: Request, res: Response): Promise<void> {
    const accountService = container.resolve(AccountService);
    const authService = container.resolve(AuthenticationService);
    const checklistItemService = container.resolve(ChecklistItemService);
    const taskService = container.resolve(TaskService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const data = req.body as ChecklistItem;

    if (!data.taskUuid) {
        throw new Error(`A checklist item must be assigned to a task, yet no taskUuid was provided`);
    }

    const task = await taskService.byUuid(data.taskUuid, account);
    if (!task) {
        throw new Error(`Unable to find task with uuid: ${data.taskUuid}`);
    }

    const checklistItem = new ChecklistItemEntity();
    checklistItem.title = data.title;
    checklistItem.checked = data.checked || false;

    // Assign relation
    checklistItem.task = task;

    const savePromise = checklistItemService.create(checklistItem);
    const dbData = await savePromise;
    const apiData = <ChecklistItem>{
        uuid: dbData.uuid,
        taskUuid: task.uuid,
        title: dbData.title,
        checked: dbData.checked,
    };

    res.send(apiData);
}
