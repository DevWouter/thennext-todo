export enum TaskRelationType {
    blocks = "blocks",
}

export interface TaskRelationEntity {
    id: number;
    uuid: string;
    sourceTaskId: number;
    targetTaskId: number;
    relationType: TaskRelationType;
}

export interface TaskRelationWithUuids extends TaskRelationEntity {
    sourceTaskUuid: string;
    targetTaskUuid: string;
}
