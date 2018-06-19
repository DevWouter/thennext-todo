import { Response, Request } from "express";
import { injectable } from "inversify";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskListService } from "../../services/task-list-service";
import { TaskService } from "../../services/task-service";
import { TaskEntity, TaskListEntity } from "../../db/entities";
import { TaskStatus } from "../../db/entities/task.entity";
import { AccountSettingsService } from "../../services/account-settings-service";
import { TaskListRightEntity, AccessRight } from "../../db/entities/task-list-right.entity";
import { TaskListRightService } from "../../services/task-list-right-service";
import { TaskList } from "./task-list.model";


export interface TaskListInput {
    readonly name: string;
}

@injectable()
export class TaskListController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountService,
        private readonly accountSettingsService: AccountSettingsService,
        private readonly taskListService: TaskListService,
        private readonly taskListRightService: TaskListRightService,
        private readonly taskService: TaskService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);
        const accountSettings = await this.accountSettingsService.of(account);

        const input = req.body as TaskListInput;

        const taskList = new TaskListEntity();
        taskList.name = input.name;
        taskList.owner = account;

        const savePromise = this.taskListService.create(taskList);
        // Also create the right
        savePromise.catch(console.error);

        const dst = await savePromise;

        const ownerRight = new TaskListRightEntity();
        ownerRight.access = AccessRight.owner;
        ownerRight.account = account;
        ownerRight.taskList = dst;
        await this.taskListRightService.create(ownerRight);

        res.send(<TaskList>{
            name: dst.name,
            uuid: dst.uuid,
            primary: dst.id === accountSettings.primaryList.id, // TO BE REMOVED
            ownerUuid: dst.owner.uuid
        });
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);
        const accountSettings = await this.accountSettingsService.of(account);

        const src = await this.taskListService.for(account);

        const dst = src.map(x => (<TaskList>{
            uuid: x.uuid,
            name: x.name,
            primary: x.id === accountSettings.primaryList.id, // TO BE REMOVED
            ownerUuid: x.owner.uuid
        }));

        res.send(dst);
    }

    async delete(req: Request, res: Response): Promise<void> {

        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);
        const accountSettings = await this.accountSettingsService.of(account);

        const taskList = await this.taskListService.byUuid(req.params.uuid, account);
        const ownership = await this.taskListService.hasOwnership(account, taskList);
        if (taskList.id === accountSettings.primaryList.id) {
            throw new Error(`Primary TaskList can not be deleted (uuid: ${taskList.uuid})`);
        }

        if (!ownership) {
            throw new Error(`You are not the owner of TaskList ${taskList.uuid}`);
        }

        await this.taskListService.destroy(taskList);

        res.send({});
    }
}
