import { Entity } from "../../models/entity";
import { Observable } from "rxjs";

export interface EntityMessengerInterface<T extends Entity> {
  /**
   * Send a command to the server to add a new entity.
   * @param entity The entity that needs to be added.
   * @param refId The reference id that needs to be used in the message send.
   */
  add(refId: string, entity: T): Observable<T>;

  /**
   * Send a command to the server to update an entity.
   * @param entity The entity that needs to be updated.
   * @param refId The reference id that needs to be used in the message send.
   */
  update(refId: string, entity: T): Observable<T>;

  /**
   * Send a command to the server to remove an entity.
   * @param entity The entity that needs to be removed.
   * @param refId The reference id that needs to be used in the message send.
   */
  remove(refId: string, entity: T): Observable<void>;

  /**
   * Send a command to the server asking to send all entities of this type.
   * @param refId The reference id that needs to be used in the message send.
   */
  sync(refId: string);

  /**
   * Returns a random ID unique for this kind of entity.
   */
  createRefId(): string;
}
