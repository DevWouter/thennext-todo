import { Request, Response } from "express";

import container from "../../inversify.config";

import { ChecklistItem } from "./checklist-item.model";

import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { ChecklistItemService } from "../../services/checklist-item-service";

export async function ChecklistItemUpdate(req: Request, res: Response): Promise<void> {
    const accountService = container.resolve(AccountService);
    const authService = container.resolve(AuthenticationService);
    const checklistItemService = container.resolve(ChecklistItemService);

    const token = authService.getAuthenticationToken(req);
    const input = req.body as ChecklistItem;

    const account = await accountService.byToken(token);
    const checklistItem = await checklistItemService.byUuid(req.params.uuid, account);
    checklistItem.title = input.title;
    checklistItem.order = input.order;
    checklistItem.checked = input.checked;

    const savePromise = checklistItemService.update(checklistItem);
    const dbData = await savePromise;
    const apiData = <ChecklistItem>{
        uuid: dbData.uuid,
        taskUuid: dbData.task.uuid,
        title: dbData.title,
        checked: dbData.checked,
    };

    res.send(apiData);
}
