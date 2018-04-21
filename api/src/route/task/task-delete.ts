import { Request, Response } from "express";
import { getConnection } from "typeorm";

import { AccountEntity, TaskListEntity, TaskEntity } from "../../db/entities";
import { getAccount } from "../../server/get-account";
import { Task } from "./task.model";
import { TaskStatus } from "../../db/entities/task.entity";
import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";


export async function TaskDelete(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const token = authService.getAuthenticationToken(req);
    const account = await getAccount(token);

    const db = await getConnection();
    const entityManager = db.createEntityManager();

    const task = await entityManager.findOne(TaskEntity, {
        where: {
            uuid: req.params.uuid,
        },
        join: {
            alias: "task",
            leftJoinAndSelect: {
                tasklist: "task.taskList",
                owner: "tasklist.owner"
            }
        }
    });


    // TODO: Add check if entity is of owner.
    if (!task) {
        throw new Error("Unable to find task with id: " + req.params.uuid);
    }

    if (task.taskList.owner.id !== account.id) {
        throw new Error("Task is not available for current user. Task.uuid: " + req.params.uuid);
    }

    await entityManager.delete(TaskEntity, task);

    // Reply that task was deleted.
    res.send({});
}
