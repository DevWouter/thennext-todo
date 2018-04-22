import { Request, Response } from "express";
import { getConnection, Connection } from "typeorm";

import { AccountEntity, TaskListEntity, TaskEntity } from "../../db/entities";

import { Task } from "./task.model";
import { TaskStatus } from "../../db/entities/task.entity";
import container from "../../inversify.config";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskService } from "../../services/task-service";


export async function TaskDelete(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskService = container.resolve(TaskService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);
    const task = await taskService.byUuid(<string>(req.params.uuid), account);

    taskService.destroy(task);

    // Reply that task was deleted.
    res.send({});
}
