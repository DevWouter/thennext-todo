import { Response, Request } from "express";
import { injectable, inject } from "inversify";
import { AuthenticationService } from "../../services/authentication-service";
import { AccountService } from "../../services/account-service";
import { TaskListService } from "../../services/task-list-service";
import { TaskService } from "../../services/task-service";
import { Task } from "../../models/task.model";
import { TaskEntity } from "../../db/entities";
import { TaskStatus } from "../../db/entities/task.entity";

@injectable()
export class TaskController {
    constructor(
        private readonly accountService: AccountService,
        private readonly authService: AuthenticationService,
        private readonly taskListService: TaskListService,
        private readonly taskService: TaskService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const model = req.body as Task;

        if (model.uuid) {
            throw new Error("No uuid should be set");
        }

        const taskList = await this.taskListService.byUuid(model.taskListUuid, account);

        if (!taskList) {
            throw new Error(`No taskList was not found with uuid '${model.taskListUuid}'`);
        }

        const task = new TaskEntity();
        const src = req.body as Task;

        task.title = src.title;
        task.description = src.description || "";
        task.status = src.status || TaskStatus.todo;
        task.createdAt = src.createdOn || new Date();
        task.updatedAt = src.updatedOn || new Date();
        task.sleepUntil = src.sleepUntil;
        task.nextChecklistOrder = 1;

        // Assign relations
        task.taskList = taskList;

        const savePromise = this.taskService.create(task);
        savePromise.catch(x => console.error(x));

        // Wait until reload has been completed.
        const dst = await savePromise;

        const result = <Task>{
            uuid: dst.uuid,
            taskListUuid: taskList.uuid,
            nextChecklistOrder: dst.nextChecklistOrder,
            title: dst.title,
            status: dst.status,
            description: dst.description,
            sleepUntil: dst.sleepUntil,
            createdOn: dst.createdAt,
            updatedOn: dst.updatedAt,
            completedOn: dst.completedAt,
        };

        res.send(result);
    }

    async index(req: Request, res: Response): Promise<void> {
        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);
        const tasks = await this.taskService.of(account);

        const dst: Task[] = tasks.map(task => <Task>{
            uuid: task.uuid,
            nextChecklistOrder: task.nextChecklistOrder,
            taskListUuid: task.taskList.uuid,
            title: task.title,
            description: task.description,
            status: task.status,
            sleepUntil: task.sleepUntil,
            createdOn: task.createdAt,
            updatedOn: task.updatedAt,
            completedOn: task.completedAt,
        });

        res.send(dst);
    }

    async update(req: Request, res: Response): Promise<void> {

        const model = req.body as Task;

        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);
        const task = await this.taskService.byUuid(<string>(req.params.uuid), account);

        task.title = model.title;
        task.description = model.description;
        task.status = model.status;
        task.nextChecklistOrder = model.nextChecklistOrder;

        task.createdAt = model.createdOn;
        task.updatedAt = model.updatedOn;
        task.completedAt = model.completedOn;
        task.sleepUntil = model.sleepUntil;

        const loadPromise = this.taskService.update(task);
        loadPromise.catch(x => console.error(x));

        // Wait until reload has been completed.
        const dst = await loadPromise;

        const result = <Task>{
            uuid: dst.uuid,
            taskListUuid: model.taskListUuid,
            nextChecklistOrder: model.nextChecklistOrder,
            title: dst.title,
            status: dst.status,
            description: dst.description,
            sleepUntil: dst.sleepUntil,
            createdOn: dst.createdAt,
            updatedOn: dst.updatedAt,
            completedOn: dst.completedAt,
        };

        res.send(result);
    }

    async delete(req: Request, res: Response): Promise<void> {

        const token = this.authService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);
        const task = await this.taskService.byUuid(<string>(req.params.uuid), account);

        this.taskService.destroy(task);

        // Reply that task was deleted.
        res.send({});
    }
}
