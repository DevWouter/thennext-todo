import { Request, Response } from "express";

import * as bcrypt from "bcryptjs";
import { Account, TransformAccount } from "./account.model";

import { AccountEntity, AccountSettingsEntity, TaskListEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";
import { TaskListRightEntity, AccessRight } from "../../db/entities/task-list-right.entity";
import { TaskListRightService } from "../../services/task-list-right-service";
import { AccountSettingsService } from "../../services/account-settings-service";
import { TaskListService } from "../../services/task-list-service";

export interface CreateAccountInput {
    readonly email: string;
    readonly password: string;
}

export async function AccountCreate(req: Request, res: Response): Promise<void> {
    try {
        const accountService = container.resolve(AccountService);
        const accountSettingsService = container.resolve(AccountSettingsService);
        const taskListService = container.resolve(TaskListService);
        const taskListRightService = container.resolve(TaskListRightService);

        const input = req.body as CreateAccountInput;
        throwIfInvalid(input);

        const accountInput = new AccountEntity();
        accountInput.email = input.email;
        accountInput.password_hash = await bcrypt.hash(input.password, SecurityConfig.saltRounds);
        accountInput.accountSettings = new AccountSettingsEntity();
        AccountSettingsEntity.setDefaultValues(accountInput.accountSettings);

        // Create account
        const accountResult = await accountService.create(accountInput);

        const primaryTaskList = new TaskListEntity();
        primaryTaskList.name = "Inbox";
        primaryTaskList.owner = accountInput;

        const taskListResult = await taskListService.create(primaryTaskList);


        const ownerRight = new TaskListRightEntity();
        ownerRight.access = AccessRight.owner;
        ownerRight.account = accountResult;
        ownerRight.taskList = primaryTaskList;
        await taskListRightService.create(ownerRight);

        const accountSettings = accountResult.accountSettings;
        accountSettings.primaryList = taskListResult;

        await accountSettingsService.update(accountSettings);

        const dst = TransformAccount(accountResult);
        res.send(dst);
    } catch (ex) {
        console.error(ex);
        res.status(500).send((<Error>ex).message);
    }
}

function throwIfInvalid(input: CreateAccountInput): void {
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

