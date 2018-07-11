import { Request, Response } from "express";

import * as bcrypt from "bcryptjs";
import { injectable } from "inversify";
import { Account } from "../../models/account.model";
import { MyAccount } from "../../models/my-account.model";

import { AccountEntity, AccountSettingsEntity, TaskListEntity } from "../../db/entities";
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

    async me(req: Request, res: Response): Promise<void> {
        const token = this.authenticationService.getAuthenticationToken(req);
        const account = await this.accountService.byToken(token);

        const response: MyAccount = {
            uuid: account.uuid,
            displayName: account.displayName,
        };

        res.send(response);
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const input = req.body as CreateAccountInput;
            this.throwIfInvalid(input);

            const accountInput = new AccountEntity();
            accountInput.email = input.email;
            accountInput.password_hash = await bcrypt.hash(input.password, SecurityConfig.saltRounds);
            accountInput.accountSettings = new AccountSettingsEntity();
            AccountSettingsEntity.setDefaultValues(accountInput.accountSettings);

            // Create account
            const accountResult = await this.accountService.create(accountInput);

            const primaryTaskList = new TaskListEntity();
            primaryTaskList.name = "Inbox";
            primaryTaskList.owner = accountInput;

            const taskListResult = await this.taskListService.create(primaryTaskList);


            const ownerRight = new TaskListRightEntity();
            ownerRight.access = AccessRight.owner;
            ownerRight.account = accountResult;
            ownerRight.taskList = primaryTaskList;
            await this.taskListRightService.create(ownerRight);

            const accountSettings = accountResult.accountSettings;
            accountSettings.primaryList = taskListResult;

            await this.accountSettingsService.update(accountSettings);

            // Create the default urgency laps
            const options = [
                { from: 0, score: 1.5 },
                { from: 7, score: 1.0 },
                { from: 14, score: 0.5 },
                { from: 21, score: 0.0 }
            ];

            options.forEach(async (x) => {
                const entity = new UrgencyLapEntity();
                entity.fromDay = x.from;
                entity.urgencyModifier = x.score;
                entity.owner = accountResult;
                await this.urgencyLapService.create(entity);
            });


            const dst = TransformAccount(accountResult);
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


