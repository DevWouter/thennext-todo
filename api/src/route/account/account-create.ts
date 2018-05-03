import { Request, Response } from "express";

import * as bcrypt from "bcryptjs";
import { Account, TransformAccount } from "./account.model";

import { AccountEntity, AccountSettingsEntity, TaskListEntity } from "../../db/entities";
import { SecurityConfig } from "../../config";
import container from "../../inversify.config";
import { AccountService } from "../../services/account-service";

export interface CreateAccountInput {
    readonly email: string;
    readonly password: string;
}

export async function AccountCreate(req: Request, res: Response): Promise<void> {
    const input = req.body as CreateAccountInput;
    throwIfInvalid(input);
    const accountService = container.resolve(AccountService);
    const account = new AccountEntity();
    account.email = input.email;
    account.password_hash = await bcrypt.hash(input.password, SecurityConfig.saltRounds);
    account.accountSettings = new AccountSettingsEntity();
    AccountSettingsEntity.setDefaultValues(account.accountSettings);

    // Create primary task list
    const primaryTaskList = new TaskListEntity();
    primaryTaskList.name = "Inbox";
    primaryTaskList.primary = true;
    account.taskLists = [primaryTaskList];

    const finalEntity = await accountService.create(account);
    const dst = TransformAccount(finalEntity);

    res.send(dst);
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

