import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import { WsMessageService } from "./ws-message-service";
import { TaskList } from "../models/task-list.model";
import { TaskListEntity, AccountSettingsEntity } from "../db/entities";
import { AccountSettingsService } from "./account-settings-service";
import { TrustedClient } from "./ws/message-client";
import { TaskListRightEntity, AccessRight } from "../db/entities/task-list-right.entity";

import { CreateEntityCommand } from "./ws/commands";

import {
    AccountRepository,
    TaskListRepository,
    TaskListRightRepository,
} from "../repositories";

@injectable()
export class TaskListService {
    constructor(
        private readonly taskListrepository: TaskListRepository,
        private readonly accountRepository: AccountRepository,
        private readonly accountSettingsRepository: AccountSettingsService,
        private readonly messageService: WsMessageService,
        private readonly taskListRightService: TaskListRightRepository,
    ) {
        // Setup
        this.setup();
    }

    private setup(): void {
        this.messageService
            .commandsOf("sync-entities")
            .pipe(filter(x => x.event.entityKind === "task-list"))
            .subscribe(x => this.sync(x.client, x.event.refId));

        this.messageService
            .commandsOf("create-entity")
            .pipe(filter(x => x.event.entityKind === "task-list"))
            .subscribe(x => this.create(x.client, x.event.entity as TaskList, x.event.refId));

        this.messageService
            .commandsOf("delete-entity")
            .pipe(filter(x => x.event.entityKind === "task-list"))
            .subscribe(x => this.delete(x.client, x.event.uuid, x.event.refId));
    }

    private async sync(client: TrustedClient, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const taskLists = await this.taskListrepository.for(account);
        const accountSettings = await this.accountSettingsRepository.of(account);

        this.messageService.send("entities-synced", {
            entityKind: "task-list",
            entities: <TaskList[]>taskLists.map(x => this.toDTO(x, accountSettings)),
        }, { clientId: client.clientId });
    }

    private async create(client: TrustedClient, entity: TaskList, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const accountSettings = await this.accountSettingsRepository.of(account);
        const taskListEntity = new TaskListEntity();
        taskListEntity.name = entity.name;
        taskListEntity.owner = account;

        const tasklist = await this.taskListrepository.create(taskListEntity);

        const ownerRight = new TaskListRightEntity();
        ownerRight.access = AccessRight.owner;
        ownerRight.account = account;
        ownerRight.taskList = tasklist;
        await this.taskListRightService.create(ownerRight);

        const rights = await this.taskListRightService.getRightsFor(tasklist);

        this.messageService.send("entity-created",
            {
                entity: this.toDTO(tasklist, accountSettings),
                entityKind: "task-list",
            }, {
                clientId: client.clientId,
                accounts: rights.map(x => x.account.id),
                refId: refId
            });
    }

    private async delete(client: TrustedClient, uuid: string, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.taskListrepository.byUuid(uuid, account);
        const rights = await this.taskListRightService.getRightsFor(entity);

        const accounts = rights.map(x => x.account.id);

        this.taskListrepository.destroy(entity);
        this.messageService.send("entity-deleted", {
            entityKind: "task-list",
            uuid: uuid,
        }, {
                clientId: client.clientId,
                accounts: accounts,
                refId: refId,
            });
    }

    private toDTO(taskList: TaskListEntity, accountSettings: AccountSettingsEntity): TaskList {
        return <TaskList>{
            uuid: taskList.uuid,
            name: taskList.name,
            primary: taskList.id === accountSettings.primaryList.id, // TO BE REMOVED
            ownerUuid: taskList.owner.uuid
        };
    }
}
