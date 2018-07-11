import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import {
    AccountRepository,
    TaskRepository,
    TaskListRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TaskEntity } from "../db/entities";
import { TrustedClient } from "./ws/message-client";
import { Task, TaskStatus } from "../models/task.model";


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
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.create(x.client, x.event.entity as Task, x.event.refId));

        this.messageService
            .commandsOf("update-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.update(x.client, x.event.entity as Task, x.event.refId));

        this.messageService
            .commandsOf("delete-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.delete(x.client, x.event.uuid, x.event.refId));
    }

    private async sync(client: TrustedClient, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const scoreShifts = await this.taskRepository.of(account);

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: scoreShifts.map(x => this.toDTO(x)),
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: Task, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const taskListPromise = this.taskListRepository.byUuid(src.taskListUuid, account);

        if (src.uuid) {
            throw new Error("No uuid should be set");
        }

        const dst = new TaskEntity();
        dst.title = src.title;
        dst.description = src.description || "";
        dst.status = src.status || TaskStatus.todo;
        dst.nextChecklistOrder = src.nextChecklistOrder || 1;

        dst.createdAt = src.createdOn || new Date();
        dst.updatedAt = src.updatedOn || new Date();
        dst.completedAt = src.completedOn;
        dst.sleepUntil = src.sleepUntil;

        if (!await taskListPromise) {
            throw new Error(`No taskList was not found with uuid '${src.taskListUuid}'`);
        }

        dst.taskList = await taskListPromise;

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
        const dst = await this.taskRepository.byUuid(src.uuid, account);

        dst.title = src.title;
        dst.description = src.description || "";
        dst.status = src.status || TaskStatus.todo;
        dst.nextChecklistOrder = src.nextChecklistOrder;

        dst.createdAt = src.createdOn || new Date();
        dst.updatedAt = src.updatedOn || new Date();
        dst.completedAt = src.completedOn;
        dst.sleepUntil = src.sleepUntil;

        const finalEntity = await this.taskRepository.update(dst);
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

    private toDTO(src: TaskEntity): Task {
        return <Task>{
            uuid: src.uuid,
            taskListUuid: src.taskList.uuid,
            nextChecklistOrder: src.nextChecklistOrder,
            title: src.title,
            status: src.status,
            description: src.description,
            sleepUntil: src.sleepUntil,
            createdOn: src.createdAt,
            updatedOn: src.updatedAt,
            completedOn: src.completedAt,
        };
    }
}
