import { Request, Response } from "express";
import container from "../../inversify.config";
import { ScoreShiftService } from "../../services/score-shift-service";
import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { toModel } from "./helpers";
import { TaskRelationService } from "../../services/task-relation-service";

export async function TaskRelationIndex(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskRelationService = container.resolve(TaskRelationService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entities = await taskRelationService.of(account);
    const result = entities.map(x => toModel(x));
    res.send(result);
}
