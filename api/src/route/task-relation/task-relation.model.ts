export enum RelationType {
    blocks = "blocks",
}

export interface TaskRelation {
    readonly uuid: string;
    readonly sourceTaskUuid: string;
    readonly targetTaskUuid: string;
    readonly relationType: RelationType;
}
