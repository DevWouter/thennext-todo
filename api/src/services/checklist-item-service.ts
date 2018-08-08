import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import {
    AccountRepository,
    ChecklistItemRepository,
    TaskRepository,
    TaskListRightRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { ChecklistItemEntity, WithTaskUuid } from "../db/entities";
import { TrustedClient } from "./ws/message-client";
import { ChecklistItem } from "../models/checklist-item.model";


@injectable()
export class ChecklistItemService {
    private readonly KIND = "checklist-item";
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly taskListRightRepository: TaskListRightRepository,
        private readonly checklistItemRepository: ChecklistItemRepository,
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
            .subscribe(x => this.create(x.client, x.event.entity as ChecklistItem, x.event.refId));

        this.messageService
            .commandsOf("update-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.update(x.client, x.event.entity as ChecklistItem, x.event.refId));

        this.messageService
            .commandsOf("delete-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.delete(x.client, x.event.uuid, x.event.refId));
    }

    private async sync(client: TrustedClient, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const scoreShifts = await this.checklistItemRepository.of(account);

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: scoreShifts.map(x => this.toDTO(x)),
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: ChecklistItem, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const taskPromise = this.taskRepository.byUuid(src.taskUuid, account);
        const dst: ChecklistItemEntity = {
            checked: src.checked,
            order: src.order,
            title: src.title,
            taskId: (await taskPromise).id,
            id: undefined,
            uuid: undefined,
        }

        const finalEntity = await this.checklistItemRepository.create(dst);
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

    private async update(client: TrustedClient, src: ChecklistItem, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const dst = await this.checklistItemRepository.byUuid(src.uuid);
        // TODO: Add check if the user is allowed to see the task that is being refered to.
        dst.checked = src.checked;
        dst.order = src.order;
        dst.title = src.title;



        const finalEntity = await this.checklistItemRepository.update(dst);
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
        const entity = await this.checklistItemRepository.byUuid(uuid);

        // TODO: Add check if the user is allowed to see the task that is being refered to.

        this.checklistItemRepository.destroy(entity);
        this.messageService.send("entity-deleted", {
            entityKind: this.KIND,
            uuid: uuid,
        }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId,
            });
    }

    private toDTO(src: ChecklistItemEntity & WithTaskUuid): ChecklistItem {
        return <ChecklistItem>{
            uuid: src.uuid,
            checked: src.checked,
            order: src.order,
            title: src.title,
            taskUuid: src.taskUuid,

        };
    }
}
