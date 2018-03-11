import { TaskEventType } from "../task-event-type.enum";

export interface TaskEventInput {
    eventType: TaskEventType;
    stamp: Date;
}