import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";

import { AccountEntity, TaskListEntity, TaskEntity } from "../../db/entities";

import { Task } from "./task.model";
import { TaskStatus } from "../../db/entities/task.entity";
import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskService } from "../../services/task-service";


export async function TaskUpdate(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskService = container.resolve(TaskService);

    const model = req.body as Task;

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const task = await taskService.byUuid(<string>(req.params.uuid), account);

    task.title = model.title;
    task.description = model.description;
    task.status = model.status;

    task.createdAt = model.createdOn;
    task.updatedAt = model.updatedOn;
    task.completedAt = model.completedOn;

    const loadPromise = taskService.update(task);
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
