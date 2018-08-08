import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import {
    AccountRepository,
    TaskRelationRepository,
    TaskRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TaskRelationEntity, TaskRelationWithUuids } from "../db/entities";
import { TrustedClient } from "./ws/message-client";
import { TaskRelation } from "../models/task-relation.model";


@injectable()
export class TaskRelationService {
    private readonly KIND = "task-relation";
    constructor(
        private readonly taskRepository: TaskRepository,
        private readonly taskRelationRepository: TaskRelationRepository,
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
            .subscribe(x => this.create(x.client, x.event.entity as TaskRelation, x.event.refId));

        this.messageService
            .commandsOf("delete-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.delete(x.client, x.event.uuid, x.event.refId));
    }

    private async sync(client: TrustedClient, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const scoreShifts = await this.taskRelationRepository.of(account);

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: scoreShifts.map(x => this.toDTO(x)),
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: TaskRelation, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const sourceTaskPromise = this.taskRepository.byUuid(src.sourceTaskUuid, account);
        const targetTaskPromise = this.taskRepository.byUuid(src.targetTaskUuid, account);
        const dst: TaskRelationEntity = {
            id: undefined,
            uuid: undefined,
            sourceTaskId: (await sourceTaskPromise).id,
            targetTaskId: (await targetTaskPromise).id,
            relationType: src.relationType,
        };

        const finalEntity = await this.taskRelationRepository.create(dst);
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

    private async delete(client: TrustedClient, uuid: string, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.taskRelationRepository.byUuid(uuid, account);

        this.taskRelationRepository.destroy(entity);
        this.messageService.send("entity-deleted", {
            entityKind: this.KIND,
            uuid: uuid,
        }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId,
            });
    }

    private toDTO(src: TaskRelationWithUuids): TaskRelation {
        return <TaskRelation>{
            uuid: src.uuid,
            relationType: src.relationType,
            sourceTaskUuid: src.sourceTaskUuid,
            targetTaskUuid: src.targetTaskUuid,
        };
    }
}
