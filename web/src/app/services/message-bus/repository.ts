import { Observable, BehaviorSubject } from "rxjs";
import { map, share, tap, filter } from "rxjs/operators";
import { Entity } from "../../models/entity";
import { EntityMessengerInterface } from "./entity-messenger";

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

    const obs = this._messenger.remove(entity)
      .pipe(share());

    const pushSub = obs
      .pipe(
        map(() => this._entries.findIndex(x => x.uuid === entity.uuid)),
        filter(item => item !== -1),
        tap(index => {
          this._entries.splice(index, 1);
          this.entries.next(this._entries);
        })
      ).subscribe(() => {
        pushSub.unsubscribe();
      });

    return obs;
  }

  sync(): Observable<T[]> {
    const obs = this._messenger.sync();

    const pushSub = obs.subscribe(entities => {
      this._entries.splice(0, this._entries.length, ...entities);
      this.entries.next(this._entries);
      pushSub.unsubscribe(); // Remove own sub.
    });

    return obs;
  }

  handle(event: RepositoryRemoveEvent | RepositoryAddEvent<T> | RepositoryUpdateEvent<T>): void {
    switch (event.type) {
      case "add": {
        this._entries.push(event.data);
        this.entries.next(this._entries);
      } break;

      case "update": {
        const src = event.data;
        const dst = this._entries.find(x => x.uuid === src.uuid);
        if (dst) {
          // Copy the values.
          // We only need to do this for external events, since internal events will already have updated the data
          Object.getOwnPropertyNames(src).forEach(prop => {
            dst[prop] = src[prop];
          });
          this.entries.next(this._entries);
        } else {
          throw new Error("Unable to find entity");
        }
      } break;

      case "remove": {
        const index = this._entries.findIndex(x => x.uuid === event.uuid);
        if (index !== -1) {
          this._entries.splice(index, 1);
          this.entries.next(this._entries);
        } else {
          throw new Error("Unable to find entity");
        }
      } break;
    }
  }
}
