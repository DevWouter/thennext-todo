export enum TaskRelationType {
    blocks = "blocks",
}

export class TaskRelationEntity {
    id: number;
    uuid: string;
    sourceTaskId: number;
    targetTaskId: number;
    relationType: TaskRelationType;
}
