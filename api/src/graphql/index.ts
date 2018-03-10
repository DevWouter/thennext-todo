import { AccountMutation, AccountQuery, AccountResolvers } from "./account";
import { AccountSettingsResolvers, AccountSettingsMutation } from "./account-settings";
import { SessionMutation, SessionQuery, SessionResolvers } from "./session";


const Mutation = {
    ...AccountMutation,
    ...AccountSettingsMutation,
    ...SessionMutation,
};

const Query = {
    ...AccountQuery,
    ...SessionQuery,
}

export const resolvers = {
    Query,
    Mutation,

    // Below are the type resolvers
    Account: AccountResolvers,
    AccountSettings: AccountSettingsResolvers,
    Session: SessionResolvers,
}
