import { Response, Request } from "express";
import { injectable } from "inversify";
import { AuthenticationService } from "../../services/authentication-service";
import { TaskListShare } from "../../models/task-list-share.model";
import { TaskListShareTokenEntity } from "../../db/entities/task-list-share-token.entity";
import { TaskListShareTokenService } from "../../services/task-list-share-token-service";
import {
    AccountRepository,
    TaskListRepository
} from "../../repositories";


export interface TaskListShareInput {
    taskListUuid: string;
    token: string;
}

@injectable()
export class TaskListShareController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountRepository,
        private readonly taskListService: TaskListRepository,
        private readonly taskListShareTokenService: TaskListShareTokenService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const input = req.body as TaskListShareInput;
        const taskList = await this.taskListService.byUuid(input.taskListUuid, account);

        if (!await this.taskListService.hasOwnership(account, taskList)) {
            res.status(403).send({ error: `You have no ownership for tasklist: ${taskList.uuid}` });
            return;
        }

        if (!input.token) {
            res.status(403).send({ error: `Missing a token` });
            return;
        }

        if (await this.taskListShareTokenService.byTokenAndListUuid(input.token, input.taskListUuid)) {
            res.status(403).send({ error: `A token for that list already exists.` });
            return;
        }

        const entity = new TaskListShareTokenEntity();
        entity.taskList = taskList;
        entity.token = input.token;

        const savePromise = this.taskListShareTokenService.create(entity);
        // Also create the right
        savePromise.catch(console.error);

        const dst = await savePromise;

        res.send(<TaskListShare>{
            taskListUuid: taskList.uuid,
            token: dst.token,
            uuid: dst.uuid,
        });
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const src = await this.taskListShareTokenService.of(account);

        const dst = src.map(x => (<TaskListShare>{
            taskListUuid: x.taskList.uuid,
            uuid: x.uuid,
            token: x.token,
        }));

        res.send(dst);
    }

    async delete(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const tasklistShareToken = await this.taskListShareTokenService.byUuid(req.params.uuid, account);

        await this.taskListShareTokenService.destroy(tasklistShareToken);

        res.send({});
    }
}
