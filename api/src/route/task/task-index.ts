import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";

import { AccountEntity } from "../../db/entities";

import { Task } from "./task.model";
import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskService } from "../../services/task-service";

export async function TaskIndex(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskService = container.resolve(TaskService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const tasks = await taskService.of(account);

    const dst: Task[] = tasks.map(task => <Task>{
        uuid: task.uuid,
        nextChecklistOrder: task.nextChecklistOrder,
        taskListUuid: task.taskList.uuid,
        title: task.title,
        description: task.description,
        status: task.status,
        sleepUntil: task.sleepUntil,
        createdOn: task.createdAt,
        updatedOn: task.updatedAt,
        completedOn: task.completedAt,
    });

    res.send(dst);
}
