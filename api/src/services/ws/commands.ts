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
}

interface SetTokenCommand {
  token: string;
}

export interface EntityCommand {
  /**
   * The type of entity.
   */
  entityKind: EntityKind;
}

interface DeleteEntityCommand extends EntityCommand {
  /**
   * The uuid of the entity that needs to be deleted.
   */
  uuid: string;
}

interface DeleteEntityCommand extends EntityCommand {
  /**
   * The type of entity.
   */
  entityKind: EntityKind;

  /**
   * The uuid of the entity that needs to be deleted.
   */
  uuid: string;
}

interface UpdateEntityCommand extends EntityCommand {
  /**
   * The entity that needs to be updated. All entities that need to update have an uuid.
   */
  entity: { uuid: string };
}

interface CreateEntityCommand extends EntityCommand {
  /**
   * A referenceId which the server will use to inform the invoking socket (and only the invoking socket) which createEvent.
   * Then that event can be mapped to the calling entity.
   */
  refId: string;

  /**
   * What kind of entity are we talking about?
   */
  entity: object;
}
