import { TaskEventType } from "./task-event-type.enum";

export interface TaskEvent {
    _id: number;
    uuid: string;
    taskUuid: string;
    eventType: TaskEventType;
    stamp: Date;
};
