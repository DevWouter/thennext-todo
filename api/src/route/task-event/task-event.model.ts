export enum TaskEventType {
    delay = "delay",
}

export interface TaskEvent {
    uuid: string;
    taskUuid: string;
    eventType: TaskEventType;
    stamp: Date;
}
