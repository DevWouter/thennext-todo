import { Request, Response } from "express";

import container from "../../inversify.config";

import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { TaskTimeLapService } from "../../services/task-time-lap-service";
import { TaskTimeLap } from "./task-time-lap.model";

export async function TaskTimeLapUpdate(req: Request, res: Response): Promise<void> {
    const accountService = container.resolve(AccountService);
    const authService = container.resolve(AuthenticationService);
    const taskTimeLapService = container.resolve(TaskTimeLapService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entity = await taskTimeLapService.byUuid(<string>(req.params.uuid), account);
    const input = req.body as TaskTimeLap;

    if (input.taskUuid !== entity.uuid) {
        throw new Error("TaskTimeEntry is associated with another task");
    }

    entity.startTime = input.start;
    entity.endTime = input.end;

    const savePromise = taskTimeLapService.update(entity);
    const dbData = await savePromise;
    const apiData = <TaskTimeLap>{
        end: dbData.endTime,
        start: dbData.startTime,
        uuid: dbData.uuid,
        taskUuid: entity.task.uuid,
    };

    res.send(apiData);
}
