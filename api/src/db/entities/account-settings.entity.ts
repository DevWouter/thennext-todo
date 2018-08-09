export interface AccountSettingsEntity {
    id: number;
    accountId: number;
    primaryListId: number;
    scrollToNewTasks: boolean;
    hideScoreInTaskList: boolean;
    defaultWaitUntil: string;
    urgencyPerDay: number;
    urgencyWhenActive: number;
    urgencyWhenDescription: number;
    urgencyWhenBlocking: number;
    urgencyWhenBlocked: number;
}

export function setAccountSettingsToDefault(settings: AccountSettingsEntity): void {
    settings.scrollToNewTasks = true;
    settings.hideScoreInTaskList = false;
    settings.defaultWaitUntil = "07:00";
    settings.urgencyPerDay = 2.0;
    settings.urgencyWhenActive = 4.0;
    settings.urgencyWhenDescription = 1.0;
    settings.urgencyWhenBlocking = 8.0;
    settings.urgencyWhenBlocked = 5.0;
}

export const DefaultAccountSettings: AccountSettingsEntity = {
    id: undefined,
    accountId: undefined,
    primaryListId: undefined,
    scrollToNewTasks: true,
    hideScoreInTaskList: false,
    defaultWaitUntil: "07:00",
    urgencyPerDay: 2.0,
    urgencyWhenActive: 4.0,
    urgencyWhenDescription: 1.0,
    urgencyWhenBlocking: 8.0,
    urgencyWhenBlocked: 5.0,
};
