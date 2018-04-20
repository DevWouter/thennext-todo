import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { AccountEntity, TaskListEntity, TaskEntity } from "../../db/entities";
import { getAuthorizationToken } from "../../server/get-authorization-token";
import { getAccount } from "../../server/get-account";
import { Task } from "./task.model";
import { TaskStatus } from "../../db/entities/task.entity";


export async function TaskUpdate(req: Request, res: Response): Promise<void> {
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

    const model = req.body as Task;

    if (!model.uuid) {
        throw new Error("An uuid is required to update a task");
    }

    const db = await getConnection();
    const entityManager = db.createEntityManager();

    // TODO: Add check if entity is of owner.

    await entityManager.update(TaskEntity, { uuid: model.uuid }, model);

    const loadPromise = entityManager.findOne(TaskEntity, { where: { uuid: model.uuid } });

    loadPromise.catch(x => console.error(x));

    // Wait until reload has been completed.
    const dst = await loadPromise;

    res.send(<Task>{
        uuid: dst.uuid,
        taskListUuid: model.taskListUuid,
        title: dst.title,
        status: dst.status,
        description: dst.description,
        createdOn: dst.createdAt,
        updatedOn: dst.updatedAt,
        completedOn: dst.completedAt,
    });
}
