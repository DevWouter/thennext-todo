import { Entity } from "./entity";

export enum TaskRelationType {
  blocks = "blocks",
}

export interface TaskRelation extends Entity {
  uuid: string;
  sourceTaskUuid: string;
  targetTaskUuid: string;
  relationType: TaskRelationType;
}
