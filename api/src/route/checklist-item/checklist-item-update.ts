import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { getAccount } from "../../server/get-account";

import { ChecklistItem } from "./checklist-item.model";
import { TaskEntity, ChecklistItemEntity } from "../../db/entities";
import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";

export async function ChecklistItemUpdate(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const token = authService.getAuthenticationToken(req);
    const account = await getAccount(token);
    const db = await getConnection();
    const entityManager = db.createEntityManager();

    const model = req.body as ChecklistItem;

    if (!model.taskUuid) {
        throw new Error(`A checklist item must be assigned to a task, yet no taskUuid was provided`);
    }

    await entityManager.update(ChecklistItemEntity,
        { uuid: model.uuid },
        { title: model.title, checked: model.checked }
    );

    const loadPromise = entityManager.findOne(ChecklistItemEntity, {
        where: { uuid: model.uuid },
        join: {
            alias: "checklistItem",
            innerJoinAndSelect: {
                task: "checklistItem.task"
            }
        }
    });

    loadPromise.catch(console.error);

    const dbData = <ChecklistItemEntity>await loadPromise;
    const apiData = <ChecklistItem>{
        uuid: dbData.uuid,
        taskUuid: dbData.task.uuid,
        title: dbData.title,
        checked: dbData.checked,
    };

    res.send(apiData);
}
