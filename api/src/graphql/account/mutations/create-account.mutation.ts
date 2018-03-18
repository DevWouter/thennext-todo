import { GraphContext } from "../../helpers";
import { Account } from "../account.model";
import { CreateAccountInput } from "./create-account.input";
import { AccountEntity, AccountSettingsEntity } from "../../../db/entities";

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
