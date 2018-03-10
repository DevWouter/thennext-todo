import { AccountMutation, AccountQuery, AccountResolvers } from "./account";
import { AccountSettingsResolvers, AccountSettingsMutation } from "./account-settings";


const Mutation = {
    ...AccountMutation,
    ...AccountSettingsMutation,
};

const Query = {
    ...AccountQuery,
}

export const resolvers = {
    Query,
    Mutation,

    // Below are the type resolvers
    Account: AccountResolvers,
    AccountSettings: AccountSettingsResolvers,
}