import { RelationType } from "./relation-type.enum";

export interface TaskRelation {
    readonly _id: number;
    readonly uuid: string;
    readonly sourceTaskUuid: string;
    readonly targetTaskUuid: string;
    readonly relationType: RelationType;
}
