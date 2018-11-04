import { Observable, BehaviorSubject } from "rxjs";
import { map, share, tap } from "rxjs/operators";
import { Entity } from "../../models/entity";
import { EntityMessengerInterface } from "./entity-messenger";

export interface RepositoryEvent<T> {
  refId: string;
  echo: boolean;
  data: T;
}

export class Repository<T extends Entity> {
  private _entries: T[] = [];
  readonly entries = new BehaviorSubject<T[]>(this._entries);

  constructor(
    private readonly _messenger: EntityMessengerInterface<T>,
  ) { }

  add(entity: T): Observable<T> {
    if (entity.uuid) {
      throw new Error("The entity has an uuid, which is not allowed when adding");
    }

    const obs = this._messenger.add(entity)
      .pipe(
        map(x => {
          entity.uuid = x.uuid;
          return entity;
        }),
        share(), // Prevent executing twice.
      );

    // Perform an internal wait to feed another entry.
    const pushSub = obs.subscribe(x => {
      this._entries.push(x);
      this.entries.next(this._entries);
      pushSub.unsubscribe(); // Remove own sub.
    });

    return obs;
  }

  update(entity: T): Observable<T> {
    if (!entity.uuid) {
      throw new Error("The entity is missing an uuid");
    }

    if (!this._entries.find(x => x.uuid === entity.uuid)) {
      throw new Error("The entity is unknown in storage");
    }

    const obs = this._messenger.update(entity)
      .pipe(
        map(x => {
          entity.uuid = x.uuid;
          return entity;
        }), share()
      );

    // We don't need to wait for an update.
    this.entries.next(this._entries);

    return obs;
  }

  remove(entity: T): Observable<void> {
    if (!entity.uuid) {
      throw new Error("The entity is missing an uuid");
    }

    if (!this._entries.find(x => x.uuid === entity.uuid)) {
      throw new Error("The entity is unknown in storage");
    }

    const obs = this._messenger.remove(entity);

    const pushSub = obs.subscribe(() => {
      this.entries.next(this._entries);
      pushSub.unsubscribe(); // Remove own sub.
    });

    return obs;
  }

  sync() {
    this._messenger.sync();
  }

}
