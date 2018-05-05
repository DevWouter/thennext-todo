import { Request, Response } from "express";

import container from "../../inversify.config";

import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskTimeLapService } from "../../services/task-time-lap-service";
import { TaskTimeLap } from "./task-time-lap.model";

export async function TaskTimeLapIndex(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskTimeLapService = container.resolve(TaskTimeLapService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entries = await taskTimeLapService.of(account);
    const dst = entries.map(item => (<TaskTimeLap>{
        uuid: item.uuid,
        taskUuid: item.task.uuid,
        start: item.startTime,
        end: item.endTime
    }));

    res.send(dst);
}
