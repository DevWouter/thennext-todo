import { EntityKind } from "./entity-kind";

/**
 * Commands that can be send to the server.
 * These are low level commands intended for authentication and messaging.
 * It's not intended for user-specefic message
 */
export interface WsCommandMap {
  "set-token": SetTokenCommand;
  "create-entity": CreateEntityCommand;
  "update-entity": UpdateEntityCommand;
  "delete-entity": DeleteEntityCommand;
  "sync-entities": EntityCommand;
  "sync-my-account": SyncMyAccountCommand;
}

export interface SetTokenCommand {
  token: string;
}

export interface EntityCommand {
  /**
   * The type of entity.
   */
  entityKind: EntityKind;

  /**
   * A referenceId which the server will use to inform the invoking socket (and only the invoking socket) which createEvent.
   * Then that event can be mapped to the calling entity.
   */
  refId: string;
}

export interface DeleteEntityCommand extends EntityCommand {
  /**
   * The uuid of the entity that needs to be deleted.
   */
  uuid: string;
}

export interface UpdateEntityCommand extends EntityCommand {
  /**
   * The entity that needs to be updated. All entities that need to update have an uuid.
   */
  entity: { uuid: string };
}

export interface CreateEntityCommand extends EntityCommand {
  /**
   * What kind of entity are we talking about?
   */
  entity: object;
}

export interface SyncMyAccountCommand {
}
