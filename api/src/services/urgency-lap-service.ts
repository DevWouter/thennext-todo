import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import {
    AccountRepository,
    UrgencyLapRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { UrgencyLapEntity } from "../db/entities";
import { TrustedClient } from "./ws/message-client";
import { UrgencyLap } from "../models/urgency-lap.model";


@injectable()
export class UrgencyLapService {
    private readonly KIND = "urgency-lap";
    constructor(
        private readonly urgencyLapRepository: UrgencyLapRepository,
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
            .subscribe(x => this.create(x.client, x.event.entity as UrgencyLap, x.event.refId));

        this.messageService
            .commandsOf("delete-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.delete(x.client, x.event.uuid, x.event.refId));
    }

    private async sync(client: TrustedClient, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const scoreShifts = await this.urgencyLapRepository.of(account);

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: scoreShifts.map(x => this.toDTO(x)),
        }, { clientId: client.clientId });
    }

    private async create(client: TrustedClient, entity: UrgencyLap, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const newEntity = new UrgencyLapEntity();
        newEntity.fromDay = entity.fromDay;
        newEntity.urgencyModifier = entity.urgencyModifier;
        newEntity.owner = account;

        const urgencyLap = await this.urgencyLapRepository.create(newEntity);
        this.messageService.send("entity-created",
            {
                entity: this.toDTO(urgencyLap),
                entityKind: this.KIND,
            }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId
            });
    }

    private async delete(client: TrustedClient, uuid: string, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const entity = await this.urgencyLapRepository.byUuid(uuid, account);

        this.urgencyLapRepository.destroy(entity);
        this.messageService.send("entity-deleted", {
            entityKind: this.KIND,
            uuid: uuid,
        }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId,
            });
    }

    private toDTO(src: UrgencyLapEntity): UrgencyLap {
        return <UrgencyLap>{
            uuid: src.uuid,
            fromDay: src.fromDay,
            urgencyModifier: src.urgencyModifier,
        };
    }
}
