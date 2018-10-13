import * as bcrypt from "bcryptjs";
import { injectable } from "inversify";

import {
    AccountRepository,
    AccountSettingsRepository,
} from "../repositories";

import { WsMessageService } from "./ws-message-service";
import { TrustedClient } from "./ws/message-client";
import { UpdateMyAccountCommand, UpdateMyPasswordCommand } from "./ws/commands";
import { PasswordCheckService } from "./password-check-service";
import { SecurityConfig } from "../config";
@injectable()
export class AccountService {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly accountSettingsRepository: AccountSettingsRepository,
        private readonly messageService: WsMessageService,
        private readonly passwordCheckService: PasswordCheckService,
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

        this.messageService
            .commandsOf("update-my-password")
            .subscribe(x => this.updatePassword(x.client, x.event));
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

        // Update yourself, in the future we might also need to communicate it to all friends.
        this.sync(client);
    }

    private async updatePassword(client: TrustedClient, command: UpdateMyPasswordCommand) {
        const account = await this.accountRepository.byId(client.accountId);

        const errors = this.passwordCheckService.validatePassword(command.newPassword);
        if (errors.length) {
            throw new Error("Invalid password:\n - " + errors.join("\n - "));
        }

        account.password_hash = await bcrypt.hash(command.newPassword, SecurityConfig.saltRounds);
        await this.accountRepository.updatePassword(account);
    }
}
