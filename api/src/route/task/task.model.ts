import { TaskRelation } from "../task-relation/task-relation.model";
import { TaskEvent } from "../task-event/task-event.model";

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

    createdOn: Date;
    updatedOn: Date;
    completedOn: Date;

    status: TaskStatus;

    tags: [String];
}
