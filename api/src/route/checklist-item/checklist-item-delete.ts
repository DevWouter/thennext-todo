import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { getAccount } from "../../server/get-account";

import { ChecklistItem } from "./checklist-item.model";
import { TaskEntity, ChecklistItemEntity } from "../../db/entities";
import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";

export async function ChecklistItemDelete(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const token = authService.getAuthenticationToken(req);
    const account = await getAccount(token);
    const db = await getConnection();
    const entityManager = db.createEntityManager();

    const model = req.body as ChecklistItem;

    await entityManager.delete(ChecklistItemEntity,
        { uuid: req.params.uuid, }
    );

    // TODO: Add check if the user owns this task.
    res.send({});
}
