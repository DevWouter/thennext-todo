import { Response, Request } from "express";
import { injectable } from "inversify";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskListRight } from "./task-list-right.model";
import { TaskListShareTokenService } from "../../services/task-list-share-token-service";
import { TaskListRightService } from "../../services/task-list-right-service";
import { AccessRight, TaskListRightEntity } from "../../db/entities/task-list-right.entity";


export interface CreateTaskListInput {
    tasklistUuid: string;
    shareToken: string;
}

@injectable()
export class TaskListRightController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountService,
        private readonly taskListRightService: TaskListRightService,
        private readonly taskListShareTokenService: TaskListShareTokenService,
    ) {
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const src = await this.taskListRightService.visibleFor(account);

        const dst = src.map(x => (<TaskListRight>{
            uuid: x.uuid,
            taskListUuid: x.taskList.uuid,
            name: x.account.email,
        }));

        res.send(dst);
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const input = req.body as CreateTaskListInput;
        const shareToken = await this.taskListShareTokenService.byTokenAndListUuid(input.shareToken, input.tasklistUuid);
        if (!shareToken) {
            res.status(403).send({ error: `The token or tasklist is invalid` });
        }

        const tasklist = shareToken.taskList;

        // Check if we already have right
        const existingRights = await this.taskListRightService.visibleFor(account);
        if (existingRights.some(right =>
            right.account.id === account.id &&
            right.taskList.id === tasklist.id)) {
            res.status(403).send({ error: `You already have access to the tasklist` });
        }

        // No access and everything valid? Then add a new right and delete the token.
        const newRightInput = new TaskListRightEntity();
        newRightInput.taskList = tasklist;
        newRightInput.account = account;
        newRightInput.access = AccessRight.default;
        const newRight = await this.taskListRightService.create(newRightInput);
        await this.taskListShareTokenService.destroy(shareToken);

        res.send(<TaskListRight>{
            taskListUuid: tasklist.uuid,
            uuid: newRight.uuid,
        });
    }

    async delete(req: Request, res: Response): Promise<void> {
        // Removes the right of a task.
        // Reject if the owner of the list is the same as the owner of the right.
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const taskListRight = await this.taskListRightService.byUuid(req.params.uuid, account);
        if (taskListRight.taskList.owner.id === taskListRight.account.id || taskListRight.access === AccessRight.owner) {
            throw new Error("Can't delete the owner of a tasklist.");
        }

        await this.taskListRightService.destroy(taskListRight);

        res.send({});
    }
}
