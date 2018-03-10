import { GraphContext } from "../../helpers";
import { AccountSettings } from "../../account-settings/account-settings.model";
import { Account } from "../account.model";
import { AccountEntity } from "../../../db/entities";
import { DecaySpeed } from "../../account-settings/decay-speed.model";

export async function getAccountSettings(obj: Account, args, context: GraphContext, info): Promise<AccountSettings> {
    const account = await context.entityManager.findOne(AccountEntity,
        {
            where: <AccountEntity>{ uuid: obj.uuid },
            relations: [
                "accountSettings",
            ]
        });

    

    const result = <AccountSettings>{
        _id: account.accountSettings.id,
        scrollToNewTasks: account.accountSettings.scrollToNewTasks,
        hideScoreInTaskList: account.accountSettings.hideScoreInTaskList,

        defaultWaitUntil: account.accountSettings.defaultWaitUntil,

        urgencyPerDay: account.accountSettings.urgencyPerDay,
        urgencyWhenActive: account.accountSettings.urgencyWhenActive,
        urgencyWhenDescription: account.accountSettings.urgencyWhenDescription,
        urgencyWhenBlocking: account.accountSettings.urgencyWhenBlocking,
        urgencyWhenBlocked: account.accountSettings.urgencyWhenBlocked,
    };


    return result;
}