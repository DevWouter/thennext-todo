import { AccountMutations, AccountQueries, AccountResolvers } from "./account";
import { AccountSettingsResolvers, AccountSettingsMutations } from "./account-settings";
import { ChecklistItemMutations, ChecklistItemQueries, ChecklistItemResolvers } from "./checklist-item";
import { SessionMutations, SessionQueries, SessionResolvers } from "./session";
import { SupportQueries } from "./support";
import { TaskEventMutations, TaskEventQueries, TaskEventResolvers } from "./task-event";
import { TaskListMutations, TaskListQueries, TaskListResolvers } from "./task-list";
import { TaskMutations, TaskQueries, TaskResolvers } from "./task";
import { TaskRelationMutations, TaskRelationQueries, TaskRelationResolvers } from "./task-relation";


const Mutation = {
    ...AccountMutations,
    ...AccountSettingsMutations,
    ...ChecklistItemMutations,
    ...SessionMutations,
    ...TaskEventMutations,
    ...TaskListMutations,
    ...TaskMutations,
    ...TaskRelationMutations,
};

const Query = {
    ...AccountQueries,
    ...ChecklistItemQueries,
    ...SessionQueries,
    ...SupportQueries,
    ...TaskEventQueries,
    ...TaskListQueries,
    ...TaskQueries,
    ...TaskRelationQueries,
};

export const resolvers = {
    Query,
    Mutation,

    // Below are the type resolvers
    Account: AccountResolvers,
    AccountSettings: AccountSettingsResolvers,
    ChecklistItem: ChecklistItemResolvers,
    Session: SessionResolvers,
    Task: TaskResolvers,
    TaskEvent: TaskEventResolvers,
    TaskList: TaskListResolvers,
    TaskRelation: TaskRelationResolvers,
};
