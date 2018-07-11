import { injectable } from "inversify";
import { filter } from "rxjs/operators";

import {
    AccountRepository,
    ScoreShiftRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { ScoreShiftEntity } from "../db/entities";
import { TrustedClient } from "./ws/message-client";
import { ScoreShift } from "../models/score-shift.model";


@injectable()
export class ScoreShiftService {
    private readonly KIND = "score-shift";
    constructor(
        private readonly scoreShiftRepository: ScoreShiftRepository,
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
            .subscribe(x => this.create(x.client, x.event.entity as ScoreShift, x.event.refId));

        this.messageService
            .commandsOf("delete-entity")
            .pipe(filter(x => x.event.entityKind === this.KIND))
            .subscribe(x => this.delete(x.client, x.event.uuid, x.event.refId));
    }

    private async sync(client: TrustedClient, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const scoreShifts = await this.scoreShiftRepository.of(account);

        this.messageService.send("entities-synced", {
            entityKind: this.KIND,
            entities: scoreShifts.map(x => this.toDTO(x)),
        }, { clientId: client.clientId, refId: refId });
    }

    private async create(client: TrustedClient, src: ScoreShift, refId: string) {
        const account = await this.accountRepository.byId(client.accountId);
        const dst = new ScoreShiftEntity();
        dst.phrase = src.phrase;
        dst.score = src.score;
        dst.created_on = src.createdOn;
        dst.updated_on = src.updatedOn;
        dst.owner = account;

        const finalEntity = await this.scoreShiftRepository.create(dst);
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
        const entity = await this.scoreShiftRepository.byUuid(uuid, account);


        this.scoreShiftRepository.destroy(entity);
        this.messageService.send("entity-deleted", {
            entityKind: this.KIND,
            uuid: uuid,
        }, {
                clientId: client.clientId,
                accounts: [account.id],
                refId: refId,
            });
    }

    private toDTO(src: ScoreShiftEntity): ScoreShift {
        return <ScoreShift>{
            uuid: src.uuid,
            phrase: src.phrase,
            score: src.score,
            createdOn: src.created_on,
            updatedOn: src.updated_on,
        };
    }
}
