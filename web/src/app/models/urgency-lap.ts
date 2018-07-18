import { Entity } from "./entity";

export interface UrgencyLap extends Entity {
  uuid: string;
  fromDay: number;
  urgencyModifier: number;
}
