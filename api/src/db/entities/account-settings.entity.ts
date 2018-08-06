export class AccountSettingsEntity {
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

    static setDefaultValues(settings: AccountSettingsEntity): void {
        settings.scrollToNewTasks = true;
        settings.hideScoreInTaskList = false;
        settings.defaultWaitUntil = "07:00";
        settings.urgencyPerDay = 2.0;
        settings.urgencyWhenActive = 4.0;
        settings.urgencyWhenDescription = 1.0;
        settings.urgencyWhenBlocking = 8.0;
        settings.urgencyWhenBlocked = 5.0;
    }
}
