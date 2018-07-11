import { TaskRelationType } from "../db/entities/task-relation.entity";

export interface TaskRelation {
    readonly uuid: string;
    readonly sourceTaskUuid: string;
    readonly targetTaskUuid: string;
    readonly relationType: TaskRelationType;
}
