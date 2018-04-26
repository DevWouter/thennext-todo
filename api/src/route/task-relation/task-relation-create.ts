import { Request, Response } from "express";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";
import { AuthenticationService } from "../../services/authentication-service";
import { toModel } from "./helpers";
import { TaskRelationService } from "../../services/task-relation-service";
import { TaskRelation } from "./task-relation.model";
import { TaskRelationEntity } from "../../db/entities";
import { TaskService } from "../../services/task-service";

export async function TaskRelationCreate(req: Request, res: Response): Promise<void> {
    const authService = container.resolve(AuthenticationService);
    const accountService = container.resolve(AccountService);
    const taskService = container.resolve(TaskService);
    const taskRelationService = container.resolve(TaskRelationService);

    const token = authService.getAuthenticationToken(req);
    const account = await accountService.byToken(token);

    const entity = new TaskRelationEntity();
    const input = req.body as TaskRelation;

    const sourceTask = await taskService.byUuid(input.sourceTaskUuid, account);
    const targetTask = await taskService.byUuid(input.targetTaskUuid, account);

    entity.relationType = input.relationType;
    entity.sourceTask = sourceTask;
    entity.targetTask = targetTask;

    const savePromise = taskRelationService.create(entity);
    savePromise.catch(x => console.error(x));

    // Wait until reload has been completed.
    const dbEntity = await savePromise;
    const apiModel = toModel(dbEntity);

    res.send(apiModel);
}
