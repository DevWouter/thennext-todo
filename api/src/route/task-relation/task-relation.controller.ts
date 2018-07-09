import { Response, Request } from "express";
import { injectable } from "inversify";

import { AuthenticationService } from "../../services/authentication-service";

import { TaskRelationEntity } from "../../db/entities/task-relation.entity";

import { TaskRelation } from "../../models/task-relation.model";
import { toModel } from "./helpers";
import {
    AccountRepository,
    TaskRepository,
    TaskRelationRepository
} from "../../repositories";


export interface TaskListInput {
    readonly name: string;
}

@injectable()
export class TaskRelationController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountRepository,
        private readonly taskService: TaskRepository,
        private readonly taskRelationService: TaskRelationRepository,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entity = new TaskRelationEntity();
        const input = req.body as TaskRelation;

        const sourceTask = await this.taskService.byUuid(input.sourceTaskUuid, account);
        const targetTask = await this.taskService.byUuid(input.targetTaskUuid, account);

        entity.relationType = input.relationType;
        entity.sourceTask = sourceTask;
        entity.targetTask = targetTask;

        const savePromise = this.taskRelationService.create(entity);
        savePromise.catch(x => console.error(x));

        // Wait until reload has been completed.
        const dbEntity = await savePromise;
        const apiModel = toModel(dbEntity);

        res.send(apiModel);
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entities = await this.taskRelationService.of(account);
        const result = entities.map(x => toModel(x));
        res.send(result);
    }

    async delete(req: Request, res: Response): Promise<void> {


        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entity = await this.taskRelationService.byUuid(<string>(req.params.uuid), account);

        this.taskRelationService.destroy(entity);
        res.send({});
    }
}
