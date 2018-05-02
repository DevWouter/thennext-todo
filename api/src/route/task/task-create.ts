import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";

import { AccountEntity, TaskListEntity, TaskEntity } from "../../db/entities";

import { Task } from "./task.model";
import { TaskStatus } from "../../db/entities/task.entity";
import { AuthenticationService } from "../../services/authentication-service";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";
import { TaskService } from "../../services/task-service";
import { TaskListService } from "../../services/task-list-service";


export async function TaskCreate(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskService = container.resolve(TaskService);
    const taskListService = container.resolve(TaskListService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const model = req.body as Task;

    if (model.uuid) {
        throw new Error("No uuid should be set");
    }

    const taskList = await taskListService.byUuid(model.taskListUuid, account);

    if (!taskList) {
        throw new Error(`No taskList was not found with uuid '${model.taskListUuid}'`);
    }

    const task = new TaskEntity();
    const src = req.body as Task;

    task.title = src.title;
    task.description = src.description || "";
    task.status = src.status || TaskStatus.todo;
    task.createdAt = src.createdOn || new Date();
    task.updatedAt = src.updatedOn || new Date();
    task.sleepUntil = src.sleepUntil;
    task.nextChecklistOrder = 1;

    // Assign relations
    task.taskList = taskList;

    const savePromise = taskService.create(task);
    savePromise.catch(x => console.error(x));

    // Wait until reload has been completed.
    const dst = await savePromise;

    const result = <Task>{
        uuid: dst.uuid,
        taskListUuid: taskList.uuid,
        nextChecklistOrder: dst.nextChecklistOrder,
        title: dst.title,
        status: dst.status,
        description: dst.description,
        sleepUntil: dst.sleepUntil,
        createdOn: dst.createdAt,
        updatedOn: dst.updatedAt,
        completedOn: dst.completedAt,
    };

    res.send(result);
}
