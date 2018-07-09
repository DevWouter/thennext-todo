import { Response, Request } from "express";
import { injectable } from "inversify";

import { AuthenticationService } from "../../services/authentication-service";
import { TaskTimeLapService } from "../../services/task-time-lap-service";

import { TaskTimeLap } from "../../models/task-time-lap.model";
import { TaskTimeLapEntity } from "../../db/entities/task-time-lap.entity";
import {
    AccountRepository,
    TaskRepository
} from "../../repositories";



export interface TaskListInput {
    readonly name: string;
}

@injectable()
export class TaskTimeLapController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountRepository,
        private readonly taskService: TaskRepository,
        private readonly taskTimeLapService: TaskTimeLapService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const data = req.body as TaskTimeLap;

        const task = await this.taskService.byUuid(data.taskUuid, account);
        if (!task) {
            throw new Error(`Unable to find task with uuid: ${data.taskUuid}`);
        }

        const entity = new TaskTimeLapEntity();
        entity.startTime = data.start;
        entity.endTime = data.end;

        // Assign relation
        entity.task = task;
        entity.owner = account;

        const savePromise = this.taskTimeLapService.create(entity);
        const dbData = await savePromise;
        const apiData = <TaskTimeLap>{
            end: dbData.endTime,
            start: dbData.startTime,
            uuid: dbData.uuid,
            taskUuid: task.uuid,
        };

        res.send(apiData);
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entries = await this.taskTimeLapService.of(account);
        const dst = entries.map(item => (<TaskTimeLap>{
            uuid: item.uuid,
            taskUuid: item.task.uuid,
            start: item.startTime,
            end: item.endTime
        }));

        res.send(dst);
    }

    async update(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entity = await this.taskTimeLapService.byUuid(<string>(req.params.uuid), account);
        const input = req.body as TaskTimeLap;

        if (input.taskUuid !== entity.uuid) {
            throw new Error("TaskTimeEntry is associated with another task");
        }

        entity.startTime = input.start;
        entity.endTime = input.end;

        const savePromise = this.taskTimeLapService.update(entity);
        const dbData = await savePromise;
        const apiData = <TaskTimeLap>{
            end: dbData.endTime,
            start: dbData.startTime,
            uuid: dbData.uuid,
            taskUuid: entity.task.uuid,
        };

        res.send(apiData);
    }

    async delete(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const entity = await this.taskTimeLapService.byUuid(<string>(req.params.uuid), account);

        this.taskTimeLapService.destroy(entity);
        res.send({});
    }
}
