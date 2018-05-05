import { Entity } from "../repositories/entity";

export interface TaskTimeLap extends Entity {
  uuid: string;
  taskUuid: string;
  start: Date;
  end?: Date;
}
