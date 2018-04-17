export interface Entity {
  // The primary key of the entity.
  // If set to empty or undefined it is considered a new entity.
  uuid: string;
}
