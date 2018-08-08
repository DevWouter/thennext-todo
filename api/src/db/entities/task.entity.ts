export enum TaskStatus {
    todo = "todo",
    active = "active",
    done = "done",
}

export interface TaskEntity {
    id: number;
    uuid: string;
    taskListId: number;
    title: string;
    description: string;
    status: TaskStatus;
    nextChecklistOrder: number;
    createdAt: Date;
    updatedAt: Date;
    completedAt: Date;
}

export interface WithTaskUuid {
    taskUuid: string;
}
