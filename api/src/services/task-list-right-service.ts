import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import {
    AccountRepository,
    TaskListShareTokenRepository,
    TaskListRepository,
    TaskListRightRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TrustedClient } from "./ws/message-client";
import { TaskListShare } from "../models/task-list-share.model";
import { TaskListRight } from "../models/task-list-right.model";
import { TaskListRightEntity, AccessRight } from "../db/entities/task-list-right.entity";
import { TaskListEntity, AccountEntity } from "../db/entities";


@injectable()
export class TaskListRightService {
    private readonly KIND = "task-list-right";
    constructor(
        private readonly taskListRepository: TaskListRepository,
        private readonly accountRepository: AccountRepository,
        private readonly messageService: WsMessageService,
        private readonly taskListRightRepository: TaskListRightRepository,
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
        const entities = await this.taskListRightRepository.visibleFor(account);

        const results: TaskListRight[] = [];
        for (let i = 0; i < entities.length; ++i) {
            const element = entities[i];
            const result = this.toDTO(element, await this.taskListRepository.byId(element.taskListId), account);
            results.push(result);
        }

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: results,
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: TaskListShare, refId: string) {
        throw new Error(`Create is not supported for ${this.KIND}`);
    }

    private async update(client: TrustedClient, src: TaskListShare, refId: string) {
        throw new Error(`Update is not supported for ${this.KIND}`);
    }

    private async delete(client: TrustedClient, uuid: string, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.taskListRightRepository.byUuid(uuid, account);
        if (entity.access === AccessRight.owner) {
            throw new Error("You can't delete owning rights");
        }

        this.taskListRightRepository.destroy(entity);
        this.messageService.send("entity-deleted", {
            entityKind: this.KIND,
            uuid: uuid,
        }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId,
            });
    }

    private toDTO(src: TaskListRightEntity, tasklist: TaskListEntity, account: AccountEntity): TaskListRight {
        return <TaskListRight>{
            uuid: src.uuid,
            taskListUuid: tasklist.uuid,
            name: account.email,
        };
    }
}
