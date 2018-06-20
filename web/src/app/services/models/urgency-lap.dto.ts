import { Entity } from "../repositories/entity";

export interface UrgencyLap extends Entity {
  uuid: string;
  fromDay: number;
  urgencyModifier: number;
}
