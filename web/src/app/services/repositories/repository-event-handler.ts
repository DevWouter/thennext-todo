import { Entity } from "../../models/entity";

export interface RepositoryEventHandler<T extends Entity> {
  onItemLoad(entry: T): void;
}
