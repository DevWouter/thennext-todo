import { EntityKind } from "./entity-kind";

export interface WsEventMap {
  "token-accepted": WsEvent;
  "token-rejected": TokenRejectedEvent;
  "entity-created": EntityCreatedEvent;
  "entity-updated": EntityUpdatedEvent;
  "entity-deleted": EntityDeletedEvent;
  "entities-synced": EntitiesSyncedEvent;
}

export interface WsEvent {
  type: keyof WsEventMap;
}

interface IEntityEvent extends WsEvent {
  entityKind: EntityKind;
}

interface IReferenceEntityEvent extends IEntityEvent {
  /**
   * A reference id is provided if the event was a result of your actions.
   * Use it to find the unknown entity on your side and set the uuid.
   * In the event none is provided the value shall be null.
   * In the event another socket was responsible for the event it shall be undefined (and as such missing)
   */
  refId?: string;
}

export interface TokenRejectedEvent extends WsEvent {
  reason: string;
}

export interface EntityCreatedEvent extends IReferenceEntityEvent {
  entity: { uuid: string };
}

export interface EntityUpdatedEvent extends IReferenceEntityEvent {
  entity: { uuid: string };
}

export interface EntityDeletedEvent extends IReferenceEntityEvent {
  uuid: string;
}

export interface EntitiesSyncedEvent extends IEntityEvent {
  entities: { uuid: string }[];
}

