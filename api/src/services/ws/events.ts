import { EntityKind } from "./entity-kind";

export interface WsEventMap {
  "token-accepted": {}; // Empty clas
  "token-rejected": TokenRejectedEvent;
  "entity-created": EntityCreatedEvent;
  "entity-updated": EntityUpdatedEvent;
  "entity-deleted": EntityDeletedEvent;
  "entities-synced": EntitiesSyncedEvent;
}

export interface WsEventBasic {
  type: keyof WsEventMap;
  /**
   * This event was caused by a client with your id.
   */
  echo: boolean;

  refId?: string;
}

// All events should derive from this.
export interface WsEvent<K extends keyof WsEventMap> extends WsEventBasic {
  type: K;
  /**
   * This event was caused by a client with your id.
   */
  echo: boolean;

  refId?: string;

  data: WsEventMap[K];
}

export interface TokenRejectedEvent {
  readonly reason: string;
}

interface IEntityEvent {
  entityKind: EntityKind;
}

export interface EntityCreatedEvent extends IEntityEvent {
  entity: { uuid: string };
}

export interface EntityUpdatedEvent extends IEntityEvent {
  entity: { uuid: string };
}

export interface EntityDeletedEvent extends IEntityEvent {
  uuid: string;
}

export interface EntitiesSyncedEvent extends IEntityEvent {
  entities: { uuid: string }[];
}

