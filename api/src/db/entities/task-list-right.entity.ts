export enum AccessRight {
    none = "none",
    default = "default",
    owner = "owner",
}

export class TaskListRightEntity {
    id: number;
    uuid: string;
    access: AccessRight;
    accountId: number;
    taskListId: number;
}
