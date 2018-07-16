import { injectable } from "inversify";

import {
    AccountRepository,
    AccountSettingsRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TrustedClient } from "./ws/message-client";


@injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly accountSettingsRepository: AccountSettingsRepository,
        private readonly messageService: WsMessageService,
    ) {
        // Setup
        this.setup();
    }

    private setup(): void {
        this.messageService
            .commandsOf("sync-my-account")
            .subscribe(x => this.sync(x.client));
    }

    private async sync(client: TrustedClient) {
        const account = await this.accountRepository.byId(client.accountId);
        const accountSettings = await this.accountSettingsRepository.of(account);

        this.messageService.send("my-account-synced", {
            uuid: account.uuid,
            displayName: account.displayName,
        }, { clientId: client.clientId });
    }
}
