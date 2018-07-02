import { TaskRelationEntity } from "../../db/entities";
import { TaskRelation } from "../../models/task-relation.model";

export function toModel(entity: TaskRelationEntity): TaskRelation {
    return {
        uuid: entity.uuid,
        relationType: entity.relationType,
        targetTaskUuid: entity.targetTask.uuid,
        sourceTaskUuid: entity.sourceTask.uuid,
    };
}
