import { Entity } from "./entity";

export interface Task extends Entity {

  uuid: string;
  taskListUuid: string;
  nextChecklistOrder: number;
  title: string;
  description: string;
  status: TaskStatus;

  createdOn: Date;
  updatedOn: Date;
  completedOn: Date;

  pkNonce: string;
}

export enum TaskStatus {
  todo = "todo",
  active = "active",
  done = "done",
}
