import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { getAccount } from "../../server/get-account";

import { ChecklistItem } from "./checklist-item.model";
import { TaskEntity, ChecklistItemEntity } from "../../db/entities";
import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";

export async function ChecklistItemCreate(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const token = authService.getAuthenticationToken(req);
    const account = await getAccount(token);
    const db = await getConnection();
    const entityManager = db.createEntityManager();

    const data = req.body as ChecklistItem;

    if (!data.taskUuid) {
        throw new Error(`A checklist item must be assigned to a task, yet no taskUuid was provided`);
    }


    const task = await entityManager.findOne(TaskEntity, {
        where: {
            uuid: data.taskUuid,
        }
    });

    if (!task) {
        throw new Error(`Unable to find task with uuid: ${data.taskUuid}`);
    }

    const checklistItem = entityManager.create(ChecklistItemEntity);
    checklistItem.title = data.title;
    checklistItem.checked = data.checked || false;

    // Assign relation
    checklistItem.task = task;

    const savePromise = entityManager
        .save(checklistItem)
        .then(x => entityManager.preload(ChecklistItemEntity, x))
        .catch(console.error);

    const dbData = <ChecklistItemEntity>await savePromise;
    const apiData = <ChecklistItem>{
        uuid: dbData.uuid,
        taskUuid: task.uuid,
        title: dbData.title,
        checked: dbData.checked,
    };

    res.send(apiData);
}
