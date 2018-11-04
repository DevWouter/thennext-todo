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
    const refId = this._messenger.createRefId();
    const obs = this._messenger.add(refId, entity)
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
    const refId = this._messenger.createRefId();
    const obs = this._messenger.update(refId, entity)
      .pipe(
        map(x => {
          entity.uuid = x.uuid;
          return entity;
        }), share()
      );

    return obs;
  }

  remove(entity: T): Observable<void> {
    const refId = this._messenger.createRefId();
    const obs = this._messenger.remove(refId, entity)
      .pipe(
        map(x => { /* Remove all information, since we don't expect a response */ })
      );

    return obs;
  }

  sync() {
    const refId = this._messenger.createRefId();
    this._messenger.sync(refId);
  }

}
