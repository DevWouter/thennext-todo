import { Entity } from "./entity";

export interface TaskListRight extends Entity {
  uuid: string;
  taskListUuid: string;
  name: string;
}
