import { GraphContext } from "../../helpers";
import { Account } from "../account.model";
import { CreateAccountInput } from "./create-account.input";
import { AccountEntity, AccountSettingsEntity } from "../../../db/entities";
import * as bcrypt from "bcryptjs";
import { SecurityConfig } from "../../../config";


export async function createAccount(obj, args: { input: CreateAccountInput }, context: GraphContext, info): Promise<Account> {
    const entityManager = context.entityManager;
    const account = entityManager.create(AccountEntity);
    account.email = args.input.email;
    account.password_hash = await bcrypt.hash(args.input.password, SecurityConfig.saltRounds);
    account.accountSettings = new AccountSettingsEntity();
    AccountSettingsEntity.setDefaultValues(account.accountSettings);
    const finalEntity = await entityManager.save(account);

    return <Account>{
        email: finalEntity.email,
        uuid: finalEntity.uuid
    };
}
