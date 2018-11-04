import { Entity } from "../../models/entity";
import { Observable } from "rxjs";

export interface EntityMessageSenderInterface<T extends Entity> {
  /**
   * Send a `add`-command to the server to add a new entity.
   * @param entity The entity that needs to be added.
   */
  add(entity: T): Observable<T>;

  /**
   * Send a `update`-command to the server to update an entity.
   * @param entity The entity that needs to be updated.
   */
  update(entity: T): Observable<T>;

  /**
   * Send a `remove`-command to the server to remove an entity.
   * @param entity The entity that needs to be removed.
   */
  remove(entity: T): Observable<void>;

  /**
   * Send a command to the server asking to send all entities of this type.
   */
  sync(): Observable<T[]>;
}

export class EntityMessageSender<T extends Entity> implements EntityMessageSenderInterface<T> {
  add(entity: T): Observable<T> {
    throw new Error("Method not implemented.");
  }

  update(entity: T): Observable<T> {
    throw new Error("Method not implemented.");
  }

  remove(entity: T): Observable<void> {
    throw new Error("Method not implemented.");
  }

  sync(): Observable<T[]> {
    throw new Error("Method not implemented.");
  }
}
