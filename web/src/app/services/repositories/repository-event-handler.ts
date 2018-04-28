import { Entity } from "./entity";

export interface RepositoryEventHandler<T extends Entity> {
  onItemLoad(entry: T): void;
}
