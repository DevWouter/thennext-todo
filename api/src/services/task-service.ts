import { injectable } from "inversify";
import { filter, tap } from "rxjs/operators";

import {
    AccountRepository,
    TaskRepository,
    TaskListRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TaskEntity, WithTasklistUuid } from "../db/entities";
import { TrustedClient } from "./ws/message-client";
import { Task, TaskStatus } from "../models/task.model";

function ensureDateTime(obj: Task, keys: string[]) {
    keys.forEach(key => {
        if (obj[key] && typeof obj[key] === "string") {
            obj[key] = new Date(obj[key]);
        }
    });
}

@injectable()
export class TaskService {
    private readonly KIND = "task";
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly taskListRepository: TaskListRepository,
        private readonly accountRepository: AccountRepository,
        private readonly messageService: WsMessageService,
    ) {
        // Setup
        this.setup();
    }

    private setup(): void {
        this.messageService
            .commandsOf("sync-entities")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.sync(x.client, x.event.refId));

        this.messageService
            .commandsOf("create-entity")
            .pipe(
                filter(x => x.event.entityKind === this.KIND),
                tap(x => ensureDateTime(x.event.entity as Task, ["createdOn", "updatedOn", "completedOn"]))
            )
            .subscribe(x => this.create(x.client, x.event.entity as Task, x.event.refId));

        this.messageService
            .commandsOf("update-entity")
            .pipe(
                filter(x => x.event.entityKind === this.KIND),
                tap(x => ensureDateTime(x.event.entity as Task, ["createdOn", "updatedOn", "completedOn"]))
            )
            .subscribe(x => this.update(x.client, x.event.entity as Task, x.event.refId));

        this.messageService
            .commandsOf("delete-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.delete(x.client, x.event.uuid, x.event.refId));
    }

    private async sync(client: TrustedClient, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entities = await this.taskRepository.of(account);

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: entities.map(x => this.toDTO(x)),
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: Task, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const taskListPromise = this.taskListRepository.byUuid(src.taskListUuid, account);

        if (src.uuid) {
            throw new Error("No uuid should be set");
        }

        const dst: TaskEntity = {
            id: undefined,
            uuid: undefined,
            title: src.title,
            description: src.description || "",
            status: src.status || TaskStatus.todo,
            nextChecklistOrder: src.nextChecklistOrder || 1,

            createdAt: src.createdOn || new Date(),
            updatedAt: src.updatedOn || new Date(),
            completedAt: src.completedOn,
            taskListId: (await taskListPromise).id,
        };

        if (!await taskListPromise) {
            throw new Error(`No taskList was not found with uuid '${src.taskListUuid}'`);
        }

        const finalEntity = await this.taskRepository.create(dst);
        this.messageService.send("entity-created",
            {
                entity: this.toDTO(finalEntity),
                entityKind: this.KIND,
            }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId
            });
    }

    private async update(client: TrustedClient, src: Task, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const task = await this.taskRepository.byUuid(src.uuid, account);

        task.title = src.title;
        task.description = src.description || "";
        task.status = src.status || TaskStatus.todo;
        task.nextChecklistOrder = src.nextChecklistOrder;

        task.createdAt = src.createdOn || new Date();
        task.updatedAt = src.updatedOn || new Date();
        task.completedAt = src.completedOn;

        const finalEntity = await this.taskRepository.update(task);
        this.messageService.send("entity-updated",
            {
                entity: this.toDTO(finalEntity),
                entityKind: this.KIND,
            }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId
            });
    }

    private async delete(client: TrustedClient, uuid: string, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.taskRepository.byUuid(uuid, account);

        this.taskRepository.destroy(entity);
        this.messageService.send("entity-deleted", {
            entityKind: this.KIND,
            uuid: uuid,
        }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId,
            });
    }

    private toDTO(src: TaskEntity & WithTasklistUuid): Task {
        return <Task>{
            uuid: src.uuid,
            taskListUuid: src.taskListUuid,
            nextChecklistOrder: src.nextChecklistOrder,
            title: src.title,
            status: src.status,
            description: src.description,
            createdOn: src.createdAt,
            updatedOn: src.updatedAt,
            completedOn: src.completedAt,
        };
    }
}
