import { TaskStatus } from "./task-status.enum";
import { TaskRelation } from "../task-relation/task-relation.model";
import { TaskEvent } from "../task-event/task-event.model";
import { ChecklistItem } from "../checklist-item/checklist-item.model";

export interface Task {
    _id: number;
    uuid: string;
    taskListUuid: string;

    title: string;
    description: string;
    
    createdOn: Date;
    updatedOn: Date;
    completedOn: Date;

    status: TaskStatus;

    tags: [String]

    relations: TaskRelation[];
    events: TaskEvent[];
    checklistItems: ChecklistItem[];
}