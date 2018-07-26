import { injectable } from "inversify";

import {
    AccountRepository,
    AccountSettingsRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TrustedClient } from "./ws/message-client";
import { UpdateMyAccountCommand } from "./ws/commands";
import { AccountEntity } from "../db/entities";


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

        this.messageService
            .commandsOf("update-my-account")
            .subscribe(x => this.update(x.client, x.event));
    }

    private async sync(client: TrustedClient) {
        const account = await this.accountRepository.byId(client.accountId);

        this.messageService.send("my-account-synced", {
            uuid: account.uuid,
            displayName: account.displayName,
        }, { clientId: client.clientId });
    }

    private async update(client: TrustedClient, command: UpdateMyAccountCommand) {
        const account = await this.accountRepository.byId(client.accountId);

        if (!(command.displayName === null || command.displayName === undefined)) {
            account.displayName = command.displayName;
        }

        await this.accountRepository.update(account);

        // Update yourself, in the future we might also need to communicate it to all friends..
        this.sync(client);
    }
}
