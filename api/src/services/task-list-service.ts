import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import { WsMessageService } from "./ws-message-service";
import { TaskList } from "../models/task-list.model";
import { TaskListEntity, AccountSettingsEntity, AccountEntity } from "../db/entities";
import { TrustedClient } from "./ws/message-client";

import {
    AccountRepository,
    TaskListRepository,
    AccountSettingsRepository,
} from "../repositories";

@injectable()
export class TaskListService {
    constructor(
        private readonly taskListrepository: TaskListRepository,
        private readonly accountRepository: AccountRepository,
        private readonly accountSettingsRepository: AccountSettingsRepository,
        private readonly messageService: WsMessageService,
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
            .commandsOf("update-entity")
            .pipe(filter(x => x.event.entityKind === "task-list"))
            .subscribe(x => this.update(x.client, x.event.entity as TaskList, x.event.refId));

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
            entities: <TaskList[]>taskLists.map(x => this.toDTO(x, accountSettings, account)),
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: TaskList, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const accountSettings = await this.accountSettingsRepository.of(account);

        const finalEntity = await this.taskListrepository.create(src.name, account);

        this.messageService.send("entity-created",
            {
                entity: this.toDTO(finalEntity, accountSettings, account),
                entityKind: "task-list",
            }, {
                clientId: client.clientId,
                accounts: [finalEntity.ownerId],
                refId: refId
            }
        );
    }

    private async update(client: TrustedClient, src: TaskList, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.taskListrepository.byUuid(src.uuid, account);

        if (entity.ownerId !== account.id) {
            throw new Error("You are not the owner of the list.");
        }

        // Only the name can be updated.
        entity.name = src.name;

        const finalEntity = await this.taskListrepository.update(entity);
        this.messageService.send("entity-updated",
            {
                entityKind: "task-list",
                entity: finalEntity,
            }, {
                clientId: client.clientId,
                accounts: [finalEntity.ownerId],
                refId: refId,
            }
        );
    }

    private async delete(client: TrustedClient, uuid: string, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.taskListrepository.byUuid(uuid, account);
        const settings = await this.accountSettingsRepository.of(account);


        if (entity.id === settings.primaryListId) {
            throw new Error("You can't delete your own primaryList");
        }

        if (entity.ownerId !== account.id) {
            throw new Error("You are not the owner of the list.");
        }

        this.taskListrepository.destroy(entity);
        this.messageService.send("entity-deleted",
            {
                entityKind: "task-list",
                uuid: uuid,
            }, {
                clientId: client.clientId,
                accounts: [entity.ownerId],
                refId: refId,
            }
        );
    }

    private toDTO(taskList: TaskListEntity, accountSettings: AccountSettingsEntity, account: AccountEntity): TaskList {
        return <TaskList>{
            uuid: taskList.uuid,
            name: taskList.name,
            ownerUuid: account.uuid,
            primary: taskList.id === accountSettings.primaryListId // TO BE REMOVED
        };
    }
}
