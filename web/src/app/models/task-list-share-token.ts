import { Entity } from "./entity";


export interface TaskListShareToken extends Entity {
  uuid: string;
  token: string;
  taskListUuid: string;
}
