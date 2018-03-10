import { CreateAccountInput, Account, GraphContext, AccountSettings } from "./models/shame";
import { AccountEntity, AccountSettingsEntity } from "../db/entities";

import { getManager } from 'typeorm';

// Query


// Mutation

export async function createAccount(obj, args: { input: CreateAccountInput }, context: GraphContext, info): Promise<Account> {
    const account = context.entityManager.create(AccountEntity);
    account.email = args.input.email;
    account.password_hash = args.input.password;
    account.accountSettings = new AccountSettingsEntity();
    AccountSettingsEntity.setDefaultValues(account.accountSettings);

    const finalEntity = await context.entityManager.save(account);

    return <Account>{
        email: finalEntity.email,
        uuid: finalEntity.uuid
    };
}

//     changePassword(input: ChangePasswordInput!): Boolean
//     changeEmail(input: ChangeEmailInput!): Boolean

// Account-Resolving
export async function account_Settings(obj: Account, args, context: GraphContext, info): Promise<AccountSettings> {
    const account = await context.entityManager.findOne(AccountEntity,
        {
            where: <AccountEntity>{ uuid: obj.uuid },
            relations: [
                "accountSettings"
            ]
        });


    return account.accountSettings;
}