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
import { TaskListRightEntity } from "../db/entities/task-list-right.entity";


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

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: entities.map(x => this.toDTO(x)),
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: TaskListShare, refId: string) {
        throw new Error(`Create is not supported for ${this.KIND}`);
        // const account = await this.accountRepository.byId(client.accountId);
        // const taskListPromise = this.taskListRepository.byUuid(src.taskListUuid, account);

        // if (src.uuid) {
        //     throw new Error("No uuid should be set");
        // }

        // const dst = new TaskListRightEntity();
        // dst.token = src.token;

        // if (!await taskListPromise) {
        //     throw new Error(`No taskList was not found with uuid '${src.taskListUuid}'`);
        // }

        // dst.taskList = await taskListPromise;

        // const finalEntity = await this.taskListRightRepository.create(dst);
        // this.messageService.send("entity-created",
        //     {
        //         entity: this.toDTO(finalEntity),
        //         entityKind: this.KIND,
        //     }, {
        //         clientId: client.clientId,
        //         accounts: [account.id],
        //         refId: refId
        //     });
    }

    private async update(client: TrustedClient, src: TaskListShare, refId: string) {
        throw new Error(`Update is not supported for ${this.KIND}`);
    }

    private async delete(client: TrustedClient, uuid: string, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.taskListRightRepository.byUuid(uuid, account);

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

    private toDTO(src: TaskListRightEntity): TaskListRight {
        return <TaskListRight>{
            uuid: src.uuid,
            taskListUuid: src.taskList.uuid,
            name: src.account.email,
        };
    }
}
