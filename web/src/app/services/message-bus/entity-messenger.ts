import { Entity } from "../../models/entity";
import { Observable } from "rxjs";

export interface EntityMessengerInterface<T extends Entity> {
  /**
   * Send a command to the server to add a new entity.
   * @param entity The entity that needs to be added.
   */
  add(entity: T): Observable<T>;

  /**
   * Send a command to the server to update an entity.
   * @param entity The entity that needs to be updated.
   */
  update(entity: T): Observable<T>;

  /**
   * Send a command to the server to remove an entity.
   * @param entity The entity that needs to be removed.
   */
  remove(entity: T): Observable<void>;

  /**
   * Send a command to the server asking to send all entities of this type.
   */
  sync();
}
