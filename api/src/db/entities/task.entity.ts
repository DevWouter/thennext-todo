export enum TaskStatus {
    todo = "todo",
    active = "active",
    done = "done",
}

export class TaskEntity {
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
