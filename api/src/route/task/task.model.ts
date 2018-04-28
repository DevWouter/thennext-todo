import { TaskRelation } from "../task-relation/task-relation.model";

export enum TaskStatus {
    todo = "todo",
    active = "active",
    done = "done",
}

export interface Task {
    uuid: string;
    taskListUuid: string;

    title: string;
    description: string;

    sleepUntil: Date;
    createdOn: Date;
    updatedOn: Date;
    completedOn: Date;

    status: TaskStatus;
}
