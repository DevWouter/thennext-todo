import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import {
    AccountRepository,
    TaskListShareTokenRepository,
    TaskListRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TaskEntity, TaskListEntity } from "../db/entities";
import { TrustedClient } from "./ws/message-client";
import { Task, TaskStatus } from "../models/task.model";
import { TaskListShare } from "../models/task-list-share.model";
import { TaskListShareTokenEntity } from "../db/entities/task-list-share-token.entity";


@injectable()
export class TaskListShareService {
    private readonly KIND = "task-list-share";
    constructor(
        private readonly taskListShareTokenRepository: TaskListShareTokenRepository,
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
            .subscribe(x => this.create(x.client, x.event.entity as TaskListShare, x.event.refId));

        this.messageService
            .commandsOf("update-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.update(x.client, x.event.entity as TaskListShare, x.event.refId));

        this.messageService
            .commandsOf("delete-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.delete(x.client, x.event.uuid, x.event.refId));
    }

    private async sync(client: TrustedClient, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entities = await this.taskListShareTokenRepository.of(account);

        const results: TaskListShare[] = [];
        for (let i = 0; i < entities.length; ++i) {
            const element = entities[i];
            const result = this.toDTO(element, await this.taskListRepository.byId(element.taskListId));
            results.push(result);
        }

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: results,
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: TaskListShare, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const taskListPromise = this.taskListRepository.byUuid(src.taskListUuid, account);

        if (src.uuid) {
            throw new Error("No uuid should be set");
        }

        const dst = new TaskListShareTokenEntity();
        dst.token = src.token;

        if (!await taskListPromise) {
            throw new Error(`No taskList was not found with uuid '${src.taskListUuid}'`);
        }

        dst.taskListId = (await taskListPromise).id;

        const finalEntity = await this.taskListShareTokenRepository.create(dst);
        this.messageService.send("entity-created",
            {
                entity: this.toDTO(finalEntity, await taskListPromise),
                entityKind: this.KIND,
            }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId
            });
    }

    private async update(client: TrustedClient, src: TaskListShare, refId: string) {
        throw new Error(`Update is not supported for ${this.KIND}`);
    }

    private async delete(client: TrustedClient, uuid: string, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.taskListShareTokenRepository.byUuid(uuid, account);

        this.taskListShareTokenRepository.destroy(entity);
        this.messageService.send("entity-deleted", {
            entityKind: this.KIND,
            uuid: uuid,
        }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId,
            });
    }

    private toDTO(src: TaskListShareTokenEntity, taskList: TaskListEntity): TaskListShare {
        return <TaskListShare>{
            uuid: src.uuid,
            taskListUuid: taskList.uuid,
            token: src.token,
        };
    }
}
