import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { AccountEntity, TaskListEntity, TaskEntity } from "../../db/entities";
import { getAuthorizationToken } from "../../server/get-authorization-token";
import { getAccount } from "../../server/get-account";
import { Task } from "./task.model";
import { TaskStatus } from "../../db/entities/task.entity";


export async function TaskCreate(req: Request, res: Response): Promise<void> {
    const token = getAuthorizationToken(req);
    const account = await getAccount(token);

    const model = req.body as Task;
    console.log("model", model);

    if (model.uuid) {
        throw new Error("No uuid should be set");
    }

    const db = await getConnection();

    const taskList = await db
        .createQueryBuilder(TaskListEntity, "taskList")
        .where("taskList.uuid = :uuid", { uuid: model.taskListUuid })
        .getOne();

    if (!taskList) {
        throw new Error(`No taskList was not found with uuid '${model.taskListUuid}'`);
    }

    console.log(taskList);

    const entityManager = db.createEntityManager();
    const task = entityManager.create(TaskEntity);
    const src = req.body as Task;


    task.title = src.title;
    task.description = src.description || "";
    task.status = src.status || TaskStatus.todo;
    task.createdAt = src.createdOn || new Date();
    task.updatedAt = src.updatedOn || new Date();

    // Assign relations
    task.taskList = taskList;

    const savePromise = entityManager.save(task).then(x => {
        // Reload the entity so that we have all the needed values.
        return entityManager.preload(TaskEntity, x);
    });

    savePromise.catch(x => console.error(x));

    // Wait until reload has been completed.
    const dst = await savePromise;

    res.send(<Task>{
        uuid: dst.uuid,
        taskListUuid: taskList.uuid,
        title: dst.title,
        status: dst.status,
        description: dst.description,
        createdOn: dst.createdAt,
        updatedOn: dst.updatedAt,
        completedOn: dst.completedAt,
    });
}