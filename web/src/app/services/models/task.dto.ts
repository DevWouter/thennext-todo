import { Entity } from "../repositories/entity";

export interface Task extends Entity {
  uuid: string;
  taskListUuid: string;
  title: string;
  description: string;
  status: TaskStatus;

  sleepUntil?: Date;

  createdOn: Date;
  updatedOn: Date;
  completedOn: Date;
}

export enum TaskStatus {
  todo = "todo",
  active = "active",
  done = "done",
}
