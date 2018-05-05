import { Request, Response } from "express";

import container from "../../inversify.config";

import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskTimeLapService } from "../../services/task-time-lap-service";

export async function TaskTimeLapDelete(req: Request, res: Response): Promise<void> {
    const accountService = container.resolve(AccountService);
    const authService = container.resolve(AuthenticationService);
    const taskTimeLapService = container.resolve(TaskTimeLapService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entity = await taskTimeLapService.byUuid(<string>(req.params.uuid), account);

    taskTimeLapService.destroy(entity);
    res.send({});
}
