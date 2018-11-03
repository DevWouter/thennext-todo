import { from, Observable } from "rxjs";
import { } from "rxjs/operators";
import { Entity } from "../../models/entity";
import { EntityMessengerInterface } from "./entity-messenger";

export class Repository<T extends Entity> {

  get entities(): Observable<T[]> {
    const _entities: T[] = [];
    return from([_entities]);
  }

  constructor(
    private readonly _messenger: EntityMessengerInterface<T>,
  ) { }

  add(entity: T) {
    const refId = this._messenger.createRefId();
    this._messenger.add(refId, entity);
  }

  update(entity: T) {
    const refId = this._messenger.createRefId();
    this._messenger.update(refId, entity);
  }

  remove(entity: T) {
    const refId = this._messenger.createRefId();
    this._messenger.remove(refId, entity);
  }

  sync() {
    const refId = this._messenger.createRefId();
    this._messenger.sync(refId);
  }
}
