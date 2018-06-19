import { Entity } from "../repositories/entity";

export interface TaskList extends Entity {
  uuid: string;
  name: string;
  primary: boolean;
  ownerUuid: string;
}
