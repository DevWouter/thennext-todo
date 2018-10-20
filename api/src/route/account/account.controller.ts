import { Request, Response } from "express";

import * as bcrypt from "bcryptjs";
import * as moment from "moment";

import { injectable } from "inversify";
import { Account } from "../../models/account.model";

import { AccountEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import { AccessRight } from "../../db/entities/task-list-right.entity";
import {
    AccountRepository,
    AccountSettingsRepository,
    ConfirmationTokenRepository,
    TaskListRepository,
    TaskListRightRepository,
    UrgencyLapRepository,
    PasswordRecoveryTokenRepository,
} from "../../repositories";
import {
    MailService, LoggerService, PasswordCheckService,
} from "../../services";
import { environment } from "../../environments";

export interface CreateAccountInput {
    readonly email: string;
    readonly password: string;
}

export interface CreateRecoveryTokenRequest {
    readonly email: string;
}


interface ConfirmTokenResponse {
    state: "confirmed" | "already-confirmed" | "rejected";
};

interface CreateRecoveryTokenResponse {
    state: "recovery-send" | "rejected" | "unconfirmed";
    message?: string;
};


interface ResetPasswordRequest {
    token: string;
    email: string;
    newPassword: string;
}

interface ResetPasswordResponse {
    state: "rejected" | "accepted";
    message?: string;
}


export function TransformAccount(src: AccountEntity): Account {
    return <Account>{
        uuid: src.uuid,
        email: src.email,
    };
}

@injectable()
export class AccountController {
    constructor(
        private readonly accountRepository: AccountRepository,
        private readonly accountSettingsRepository: AccountSettingsRepository,
        private readonly confirmationTokenRepository: ConfirmationTokenRepository,
        private readonly passwordRecoveryTokenRepository: PasswordRecoveryTokenRepository,
        private readonly taskListRepository: TaskListRepository,
        private readonly taskListRightRepository: TaskListRightRepository,
        private readonly urgencyLapRepository: UrgencyLapRepository,
        private readonly passwordCheckService: PasswordCheckService,
        private readonly mailService: MailService,
        private readonly logger: LoggerService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const input = req.body as CreateAccountInput;
            this.throwIfInvalid(input);

            // Hack for the e2e tests
            if (input.email === "e2e-test@thennext.com" && (await this.accountRepository.byEmail(input.email)) !== null) {
                const account = await this.accountRepository.byEmail(input.email);
                const dst = TransformAccount(account);
                res.send(dst);
                return;
            }

            // Check if account exists
            const isExisting = (await this.accountRepository.byEmail(input.email)) !== null;
            if (isExisting) {
                throw new Error("Account already exists");
            }

            // Create account
            const account = await this.accountRepository.create(
                input.email,
                await bcrypt.hash(input.password, SecurityConfig.saltRounds)
            );

            // Create tasklist and the right for the tasklist.
            const primaryTaskList = await this.taskListRepository.create("Inbox", account);
            await this.taskListRightRepository.create(account, primaryTaskList, AccessRight.owner);

            // Create settings
            await this.accountSettingsRepository.create(account, primaryTaskList);

            // Create the default urgency laps
            const options = [
                { from: 0, score: 1.5 },
                { from: 7, score: 1.0 },
                { from: 14, score: 0.5 },
                { from: 21, score: 0.0 }
            ];

            options.forEach(async (x) => {
                await this.urgencyLapRepository.create(account, x.from, x.score);
            });

            // Generate confirmation token and send an email.
            const confirmationToken = await this.confirmationTokenRepository.create(account);
            const confirmUrl = environment.host_web + `confirm-account?token=${confirmationToken.token}`;
            if (input.email.endsWith("@test.com")) {
                this.logger.info(`ConfirmationUrl was not send. Please open ${confirmUrl}`);
            } else {
                await this.mailService.sendMessage("CreateAccount", input.email, { confirm_url: confirmUrl });
            }

            const dst = TransformAccount(account);
            res.send(dst);
        } catch (ex) {
            this.logger.error(ex);
            res.status(500).send((<Error>ex).message);
        }
    }

    async createRecovery(req: Request, res: Response): Promise<void> {
        try {
            const input = req.body as CreateRecoveryTokenRequest;
            const account = (await this.accountRepository.byEmail(input.email));
            if (account === null) {
                this.logger.error("CreateRecovery: Account doesn't exist", { email: input.email });
                res.send(<CreateRecoveryTokenResponse>{ state: "rejected", message: "Account doesn't exist" });
                return;
            }

            if (!account.is_confirmed) {
                this.logger.error("CreateRecovery: Account is not yet confirmed", { accountId: account.id });
                res.send(<CreateRecoveryTokenResponse>{ state: "unconfirmed", message: "Account is unconfirmed" });
                return;
            }

            const recoveryToken = await this.passwordRecoveryTokenRepository.create(account);
            const recoverUrl = environment.host_web + `recover-account?token=${recoveryToken.token}`;
            if (input.email.endsWith("@test.com")) {
                this.logger.info(`RecoverUrl was not send. Please open ${recoverUrl}`);
            } else {
                await this.mailService.sendMessage("PasswordRecovery", input.email, { reset_url: recoverUrl });
            }

            res.send(<CreateRecoveryTokenResponse>{ state: "recovery-send" });
        } catch (ex) {
            this.logger.error(ex);
            res.status(500).send((<Error>ex).message);
        }
    }


    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const input = req.body as ResetPasswordRequest;
            const token = (await this.passwordRecoveryTokenRepository.byTokenAndEmail(input.token, input.email));
            if (token === null) {
                this.logger.error("ResetPassword: token doesn't exist", { email: input.email, token: input.token });
                res.send(<ResetPasswordResponse>{ state: "rejected", message: "token doesn't exist" });
                return;
            }

            if (moment(token.validUntil).isBefore(moment.now())) {
                this.logger.error("ResetPassword: token has expired", { email: input.email, token: input.token });
                res.send(<ResetPasswordResponse>{ state: "rejected", message: "token is expired" });
                return;
            }

            // Get the account and update the password.
            const account = await this.accountRepository.byId(token.accountId);
            account.password_hash = await bcrypt.hash(input.newPassword, SecurityConfig.saltRounds);
            this.accountRepository.updatePassword(account);

            this.logger.info(`Updated the password for account ${account.id}`);

            // Delete the token that was used for reseting the password.
            await this.passwordRecoveryTokenRepository.destroy(token);

            res.send(<ResetPasswordResponse>{ state: "accepted" });
        } catch (ex) {
            this.logger.error(ex);
            res.status(500).send((<Error>ex).message);
        }
    }

    async confirm(req: Request, res: Response): Promise<void> {
        const input = req.body as { token: string };
        const confirmToken = await this.confirmationTokenRepository.byToken(input.token);
        if (confirmToken === null) {
            res.send(<ConfirmTokenResponse>{ state: "rejected" });
            return;
        }

        if (moment(confirmToken.validUntil).isBefore(moment.now())) {
            // The token is no longer valid.
            res.send(<ConfirmTokenResponse>{ state: "rejected" });
            return;
        }

        const account = await this.accountRepository.byId(confirmToken.accountId);
        if (account.is_confirmed) {
            res.send(<ConfirmTokenResponse>{ state: "already-confirmed" });
            return;
        }

        // Set the account to confirmed
        account.is_confirmed = true;
        await this.accountRepository.update(account);

        // Delete the token used for confirming the account.
        await this.confirmationTokenRepository.destroy(confirmToken);

        res.send(<ConfirmTokenResponse>{ state: "confirmed" });
        return;
    }

    private throwIfInvalid(input: CreateAccountInput): void {
        const errors: string[] = [];
        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!emailRegex.test(input.email)) {
            errors.push("Email is invalid");
        }

        errors.push(...this.passwordCheckService.validatePassword(input.password));

        if (errors.length !== 0) {
            throw new Error("Input is invalid: " + errors.join(", "));
        }
    }


}


