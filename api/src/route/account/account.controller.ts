import { Request, Response } from "express";

import * as bcrypt from "bcryptjs";
import { injectable } from "inversify";
import { Account } from "../../models/account.model";
import { MyAccount } from "../../models/my-account.model";

import { AccountEntity, AccountSettingsEntity, TaskListEntity, DefaultAccountSettings } from "../../db/entities";
import { SecurityConfig } from "../../config";
import { TaskListRightEntity, AccessRight } from "../../db/entities/task-list-right.entity";
import { AuthenticationService } from "../../services/authentication-service";
import { UrgencyLapEntity } from "../../db/entities/urgency-lap.entity";
import {
    AccountRepository,
    TaskListRepository,
    TaskListRightRepository,
    AccountSettingsRepository,
    UrgencyLapRepository
} from "../../repositories";

export interface CreateAccountInput {
    readonly email: string;
    readonly password: string;
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
        private readonly accountService: AccountRepository,
        private readonly accountSettingsService: AccountSettingsRepository,
        private readonly taskListService: TaskListRepository,
        private readonly taskListRightService: TaskListRightRepository,
        private readonly authenticationService: AuthenticationService,
        private readonly urgencyLapService: UrgencyLapRepository,
    ) {
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const input = req.body as CreateAccountInput;
            this.throwIfInvalid(input);

            // Check if account exists
            const isExisting = (await this.accountService.byEmail(input.email)) !== null;
            if (isExisting) {
                throw new Error("Account already exists");
            }

            // Create account
            const account = await this.accountService.create(
                input.email,
                await bcrypt.hash(input.password, SecurityConfig.saltRounds)
            );

            // Create tasklist and the right for the tasklist.
            const primaryTaskList = await this.taskListService.create("Inbox", account);
            await this.taskListRightService.create(account, primaryTaskList, AccessRight.owner);

            // Create settings
            await this.accountSettingsService.create(account, primaryTaskList);

            // Create the default urgency laps
            const options = [
                { from: 0, score: 1.5 },
                { from: 7, score: 1.0 },
                { from: 14, score: 0.5 },
                { from: 21, score: 0.0 }
            ];

            options.forEach(async (x) => {
                await this.urgencyLapService.create(account, x.from, x.score);
            });

            const dst = TransformAccount(account);
            res.send(dst);
        } catch (ex) {
            console.error(ex);
            res.status(500).send((<Error>ex).message);
        }
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


