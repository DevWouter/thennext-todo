import { Entity } from "../repositories/entity";

export interface TaskListShareToken extends Entity {
  uuid: string;
  token: string;
  taskListUuid: string;
}
