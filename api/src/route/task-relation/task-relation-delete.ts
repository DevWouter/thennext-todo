import { Request, Response } from "express";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { toModel } from "./helpers";
import { TaskRelationService } from "../../services/task-relation-service";
import { TaskRelation } from "./task-relation.model";
import { TaskRelationEntity } from "../../db/entities";
import { TaskService } from "../../services/task-service";

export async function TaskRelationDestroy(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskService = container.resolve(TaskService);
    const taskRelationService = container.resolve(TaskRelationService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entity = await taskRelationService.byUuid(<string>(req.params.uuid), account);

    taskRelationService.destroy(entity);
    res.send({});
}
