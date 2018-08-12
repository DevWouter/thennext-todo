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
} from "../../repositories";
import {
    MailService,
} from "../../services";
import { environment } from "../../environments";
import { getHeapStatistics } from "v8";

export interface CreateAccountInput {
    readonly email: string;
    readonly password: string;
}

interface ConfirmTokenResponse {
    state: "confirmed" | "already-confirmed" | "rejected";
};


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
        private readonly taskListRepository: TaskListRepository,
        private readonly taskListRightRepository: TaskListRightRepository,
        private readonly urgencyLapRepository: UrgencyLapRepository,
        private readonly mailService: MailService,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const input = req.body as CreateAccountInput;
            this.throwIfInvalid(input);

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
                console.log(`ConfirmationUrl was not send. Please open ${confirmUrl}`);
            } else {
                await this.mailService.sendMessage("CreateAccount", input.email, { confirm_url: confirmUrl });
            }

            const dst = TransformAccount(account);
            res.send(dst);
        } catch (ex) {
            console.error(ex);
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
            console.log(account);
            res.send(<ConfirmTokenResponse>{ state: "already-confirmed" });
            return;
        }

        // Set the account to confirmed
        account.is_confirmed = true;
        await this.accountRepository.update(account);

        res.send(<ConfirmTokenResponse>{ state: "confirmed" });
        return;
    }

    private throwIfInvalid(input: CreateAccountInput): void {
        const errors: string[] = [];
        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (!emailRegex.test(input.email)) {
            errors.push("Email is invalid");
        }

        if (input.password.length === 0) {
            errors.push("Empty password is not allowed");
        }

        if (input.password.trim().length !== input.password.length) {
            errors.push("Password can not contain whitespace at start or end");
        }

        if (errors.length !== 0) {
            throw new Error("Input is invalid: " + errors.join(", "));
        }
    }


}


