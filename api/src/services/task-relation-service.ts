import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import {
    AccountRepository,
    TaskRelationRepository,
    TaskRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TaskRelationEntity } from "../db/entities";
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
        }, { clientId: client.clientId });
    }

    private async create(client: TrustedClient, entity: TaskRelation, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const sourceTaskPromise = this.taskRepository.byUuid(entity.sourceTaskUuid, account);
        const targetTaskPromise = this.taskRepository.byUuid(entity.targetTaskUuid, account);
        const newEntity = new TaskRelationEntity();
        newEntity.sourceTask = await sourceTaskPromise;
        newEntity.targetTask = await targetTaskPromise;
        newEntity.relationType = entity.relationType;

        const taskRelation = await this.taskRelationRepository.create(newEntity);
        this.messageService.send("entity-created",
            {
                entity: this.toDTO(taskRelation),
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

    private toDTO(src: TaskRelationEntity): TaskRelation {
        return <TaskRelation>{
            uuid: src.uuid,
            relationType: src.relationType,
            sourceTaskUuid: src.sourceTask.uuid,
            targetTaskUuid: src.targetTask.uuid,
        };
    }
}
