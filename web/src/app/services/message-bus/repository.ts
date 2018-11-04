import { Observable, BehaviorSubject } from "rxjs";
import { map, share, tap, filter } from "rxjs/operators";
import { Entity } from "../../models/entity";
import { EntityMessageSenderInterface } from "./entity-message-sender";

interface RepositoryEvent {
  type: "add" | "update" | "remove";
}

interface RepositoryAddEvent<T extends Entity> extends RepositoryEvent {
  type: "add";
  data: T;
}
interface RepositoryUpdateEvent<T extends Entity> {
  type: "update";
  data: T;
}
interface RepositoryRemoveEvent {
  type: "remove";
  uuid: string;
}

export class Repository<T extends Entity> {
  private readonly _entities: T[] = [];
  private readonly $entities = new BehaviorSubject<T[]>(this._entities);
  public readonly entities = this.$entities.asObservable();

  constructor(
    private readonly _send: EntityMessageSenderInterface<T>,
  ) { }

  add(entity: T): Observable<T> {
    if (entity.uuid) {
      throw new Error("The entity has an uuid, which is not allowed when adding");
    }

    const obs = this._send.add(entity)
      .pipe(
        map(x => {
          entity.uuid = x.uuid;
          return entity;
        }),
        share(), // Prevent executing twice.
      );

    // Perform an internal wait to feed another entry.
    const pushSub = obs.subscribe(x => {
      this._entities.push(x);
      this.$entities.next(this._entities);
      pushSub.unsubscribe(); // Remove own sub.
    });

    return obs;
  }

  update(entity: T): Observable<T> {
    if (!entity.uuid) {
      throw new Error("The entity is missing an uuid");
    }

    if (!this._entities.find(x => x.uuid === entity.uuid)) {
      throw new Error("The entity is unknown in storage");
    }

    const obs = this._send.update(entity)
      .pipe(
        map(() => {
          // Return the original entity
          return entity;
        }), share()
      );

    // We don't need to wait for an update.
    this.$entities.next(this._entities);

    return obs;
  }

  remove(entity: T): Observable<void> {
    if (!entity.uuid) {
      throw new Error("The entity is missing an uuid");
    }

    if (!this._entities.find(x => x.uuid === entity.uuid)) {
      throw new Error("The entity is unknown in storage");
    }

    const obs = this._send.remove(entity)
      .pipe(share());

    const pushSub = obs
      .pipe(
        map(() => this._entities.findIndex(x => x.uuid === entity.uuid)),
        filter(item => item !== -1),
        tap(index => {
          this._entities.splice(index, 1);
          this.$entities.next(this._entities);
        })
      ).subscribe(() => {
        pushSub.unsubscribe();
      });

    return obs;
  }

  sync(): Observable<T[]> {
    const obs = this._send.sync();

    const pushSub = obs.subscribe(entities => {
      this._entities.splice(0, this._entities.length, ...entities);
      this.$entities.next(this._entities);
      pushSub.unsubscribe(); // Remove own sub.
    });

    return obs;
  }

  handle(event: RepositoryRemoveEvent | RepositoryAddEvent<T> | RepositoryUpdateEvent<T>): void {
    switch (event.type) {
      case "add": {
        this._entities.push(event.data);
        this.$entities.next(this._entities);
      } break;

      case "update": {
        const src = event.data;
        const dst = this._entities.find(x => x.uuid === src.uuid);
        if (dst) {
          // Copy the values.
          // We only need to do this for external events, since internal events will already have updated the data
          Object.getOwnPropertyNames(src).forEach(prop => {
            dst[prop] = src[prop];
          });
          this.$entities.next(this._entities);
        } else {
          throw new Error("Unable to find entity");
        }
      } break;

      case "remove": {
        const index = this._entities.findIndex(x => x.uuid === event.uuid);
        if (index !== -1) {
          this._entities.splice(index, 1);
          this.$entities.next(this._entities);
        } else {
          throw new Error("Unable to find entity");
        }
      } break;
    }
  }
}
