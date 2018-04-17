import { Entity } from "./entity";

export interface RepositoryRestoreTranslator<T extends Entity> {
  translate(entry: T): void;
}
