import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";

import { ChecklistItem } from "./checklist-item.model";
import { TaskEntity, ChecklistItemEntity } from "../../db/entities";
import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";
import { ChecklistItemService } from "../../services/checklist-item-service";

export async function ChecklistItemDelete(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const checklistItemService = container.resolve(ChecklistItemService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const checklistItem = await checklistItemService.byUuid(req.params.uuid, account);

    await checklistItemService.destroy(checklistItem);

    res.send({});
}
