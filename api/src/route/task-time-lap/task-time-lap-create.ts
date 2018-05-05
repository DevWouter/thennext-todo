import { Request, Response } from "express";

import container from "../../inversify.config";

import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { TaskTimeLap } from "./task-time-lap.model";
import { TaskTimeLapService } from "../../services/task-time-lap-service";
import { TaskService } from "../../services/task-service";
import { TaskTimeLapEntity } from "../../db/entities";

export async function TaskTimeLapCreate(req: Request, res: Response): Promise<void> {
    const accountService = container.resolve(AccountService);
    const authService = container.resolve(AuthenticationService);
    const taskTimeLapService = container.resolve(TaskTimeLapService);
    const taskService = container.resolve(TaskService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const data = req.body as TaskTimeLap;

    const task = await taskService.byUuid(data.taskUuid, account);
    if (!task) {
        throw new Error(`Unable to find task with uuid: ${data.taskUuid}`);
    }

    const entity = new TaskTimeLapEntity();
    entity.startTime = data.start;
    entity.endTime = data.end;

    // Assign relation
    entity.task = task;
    entity.owner = account;

    const savePromise = taskTimeLapService.create(entity);
    const dbData = await savePromise;
    const apiData = <TaskTimeLap>{
        end: dbData.endTime,
        start: dbData.startTime,
        uuid: dbData.uuid,
        taskUuid: task.uuid,
    };

    res.send(apiData);
}
