import { GraphContext } from "../../helpers";
import { AccountEntity, AccountSettingsEntity } from "../../../db/entities";
import { AccountSettingsInput } from "./account-settings.input";
import { AccountSettings } from "../account-settings.model";

export async function updateAccountSettings(obj, args: { input: AccountSettingsInput }, context: GraphContext, info): Promise<AccountSettings> {
    throw new Error('Not implemented');
}