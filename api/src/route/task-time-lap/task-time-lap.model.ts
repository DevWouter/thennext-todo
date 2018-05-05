export interface TaskTimeLap {
    uuid: string;
    taskUuid: string;
    start: Date;
    end: Date | null;
}
