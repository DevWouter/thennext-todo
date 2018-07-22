import { Entity } from "./entity";

export interface ScoreShift extends Entity {
  uuid: string;
  phrase: string;
  score: number;
  createdOn: Date;
  updatedOn: Date;
}
