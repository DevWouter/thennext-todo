import { Entity } from "../../models/entity";

export interface EntityEventCallbacksOptions {
  echo: boolean;
  refId?: string;
}

export interface EntityEventCallbacks<T extends Entity> {
  onEntitiesSynced(entities: T[], options: EntityEventCallbacksOptions);
  onEntityCreated(entity: T, options: EntityEventCallbacksOptions);
  onEntityUpdated(entity: T, options: EntityEventCallbacksOptions);
  onEntityDeleted(uuid: string, options: EntityEventCallbacksOptions);
}
