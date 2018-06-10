import { Entity } from "../repositories/entity";

export interface TaskListRight extends Entity {
  uuid: string;
  taskListUuid: string;
  name: string;
}
