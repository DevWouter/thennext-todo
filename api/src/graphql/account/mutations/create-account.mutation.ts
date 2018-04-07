import { GraphContext } from "../../helpers";
import { Account } from "../account.model";
import { CreateAccountInput } from "./create-account.input";
import { AccountEntity, AccountSettingsEntity, TaskListEntity } from "../../../db/entities";
import * as bcrypt from "bcryptjs";
import { SecurityConfig } from "../../../config";
import { EntityManager } from "typeorm";


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

export async function createAccount(obj, args: { input: CreateAccountInput }, context: GraphContext, info): Promise<Account> {
    throwIfInvalid(args.input);
    const entityManager = context.entityManager;
    const account = entityManager.create(AccountEntity);
    account.email = args.input.email;
    account.password_hash = await bcrypt.hash(args.input.password, SecurityConfig.saltRounds);
    account.accountSettings = new AccountSettingsEntity();
    AccountSettingsEntity.setDefaultValues(account.accountSettings);

    // Create primary task list
    const primaryTaskList = entityManager.create(TaskListEntity);
    primaryTaskList.name = "Inbox";
    primaryTaskList.primary = true;
    account.taskLists = [primaryTaskList];

    const finalEntity = await entityManager.save(account);

    return <Account>{
        email: finalEntity.email,
        uuid: finalEntity.uuid
    };
}
