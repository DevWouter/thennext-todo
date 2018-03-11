import { RelationType } from "../relation-type.enum";

export interface TaskRelationInput {
    sourceTaskUuid: string;
    targetTaskUuid: string;
    relationType: RelationType;
}