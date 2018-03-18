import { TaskStatus } from "../task-status.enum";

export interface TaskInput {
    readonly title: string;
    readonly description: string;

    readonly status: TaskStatus;
    readonly tags: string[];
}
