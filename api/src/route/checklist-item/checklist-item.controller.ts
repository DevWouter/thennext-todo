import { Response, Request } from "express";
import { injectable } from "inversify";
import { AuthenticationService } from "../../services/authentication-service";
import { ChecklistItemEntity } from "../../db/entities";
import { ChecklistItemService } from "../../services/checklist-item-service";
import { ChecklistItem } from "../../models/checklist-item.model";
import { AccountRepository, TaskRepository } from "../../repositories";

@injectable()
export class ChecklistItemController {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly accountService: AccountRepository,
        private readonly taskService: TaskRepository,
        private readonly checklistItemService: ChecklistItemService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const data = req.body as ChecklistItem;

        if (!data.taskUuid) {
            throw new Error(`A checklist item must be assigned to a task, yet no taskUuid was provided`);
        }

        const task = await this.taskService.byUuid(data.taskUuid, account);
        if (!task) {
            throw new Error(`Unable to find task with uuid: ${data.taskUuid}`);
        }

        const checklistItem = new ChecklistItemEntity();
        checklistItem.title = data.title;
        checklistItem.checked = data.checked || false;
        checklistItem.order = data.order || 0;

        // Assign relation
        checklistItem.task = task;

        const savePromise = this.checklistItemService.create(checklistItem);
        const dbData = await savePromise;
        const apiData = <ChecklistItem>{
            uuid: dbData.uuid,
            order: dbData.order,
            taskUuid: task.uuid,
            title: dbData.title,
            checked: dbData.checked,
        };

        res.send(apiData);
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);

        const account = await this.accountService.byToken(token);
        const src = await this.checklistItemService.of(account);

        const dst = src.map(item => (<ChecklistItem>{
            uuid: item.uuid,
            order: item.order,
            checked: item.checked,
            title: item.title,
            taskUuid: item.task.uuid
        }));

        res.send(dst);
    }

    async update(req: Request, res: Response): Promise<void> {

        const token = this.authService.getAuthenticationToken(req);
        const input = req.body as ChecklistItem;

        const account = await this.accountService.byToken(token);
        const checklistItem = await this.checklistItemService.byUuid(req.params.uuid, account);
        checklistItem.title = input.title;
        checklistItem.order = input.order;
        checklistItem.checked = input.checked;

        const savePromise = this.checklistItemService.update(checklistItem);
        const dbData = await savePromise;
        const apiData = <ChecklistItem>{
            uuid: dbData.uuid,
            taskUuid: dbData.task.uuid,
            title: dbData.title,
            checked: dbData.checked,
        };

        res.send(apiData);
    }

    async delete(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);
        const checklistItem = await this.checklistItemService.byUuid(req.params.uuid, account);

        await this.checklistItemService.destroy(checklistItem);

        res.send({});
    }
}
