import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { TaskList } from "./task-list.model";
import { TaskListEntity } from "../../db/entities";

import { getAccount } from "../../server/get-account";
import { getAuthorizationToken } from "../../server/get-authorization-token";

export interface TaskListInput {
    readonly name: string;
}

export async function taskListCreate(req: Request, res: Response): Promise<void> {
    const entityManager = getConnection().createEntityManager();
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

    const taskList = entityManager.create(TaskListEntity);
    const args = req.body as TaskListInput;
    taskList.name = args.name;
    taskList.owner = account;

    const savePromise = entityManager.save(taskList).then(x => {
        // Reload the entity so that we have all the needed values.
        return entityManager.preload(TaskListEntity, x);
    });

    savePromise.catch(x => console.error(x));

    res.send({
        name: taskList.name,
        uuid: taskList.uuid,
        primary: taskList.primary,
        ownerUuid: account.uuid,
    });
}
