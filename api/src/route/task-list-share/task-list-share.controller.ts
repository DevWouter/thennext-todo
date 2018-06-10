import { Response, Request } from "express";
import { injectable } from "inversify";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskListService } from "../../services/task-list-service";
import { AccountSettingsService } from "../../services/account-settings-service";
import { TaskListShare } from "./task-list-share.model";
import { TaskListShareTokenEntity } from "../../db/entities/task-list-share-token.entity";
import { TaskListShareTokenService } from "../../services/task-list-share-token-service";


export interface TaskListShareInput {
    tasklistUuid: string;
}

@injectable()
export class TaskListShareController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountService,
        private readonly accountSettingsService: AccountSettingsService,
        private readonly taskListService: TaskListService,
        private readonly taskListShareTokenService: TaskListShareTokenService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const input = req.body as TaskListShareInput;
        const taskList = await this.taskListService.byUuid(input.tasklistUuid, account);

        if (!this.taskListService.hasOwnership(account, taskList)) {
            res.status(403).send({ error: `You have no ownership for tasklist: ${taskList.uuid}` });
            return;
        }

        const entity = new TaskListShareTokenEntity();
        entity.taskList = taskList;

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
        const accountSettings = await this.accountSettingsService.of(account);

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
        const accountSettings = await this.accountSettingsService.of(account);

        const tasklistShareToken = await this.taskListShareTokenService.byUuid(req.params.uuid, account);

        await this.taskListShareTokenService.destroy(tasklistShareToken);

        res.send({});
    }
}
