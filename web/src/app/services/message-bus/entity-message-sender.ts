import { Entity } from "../../models/entity";
import { Observable, Subject, OperatorFunction, pipe } from "rxjs";
import { WsConnectionFactoryInterface } from "./ws-connection-factory";
import { WsConnectionInterface } from "./ws-connection";
import { EntityRefIdGenerator } from "./entity-refid-generator";
import { filter, map } from "rxjs/operators";
import { WsEvent, WsEventBasic, WsEventMap } from "../ws/events";

function filterEvent<K extends keyof WsEventMap>(eventType: K, refId: string) {
  return (source: Observable<WsEventBasic>) => {
    return source.pipe(
      filter(x => x.echo),
      filter(x => x.refId === refId),
      filter(x => x.type === eventType),
      map(x => x as WsEvent<K>),
    )
  };
};

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
  private _nextId = 0;

  private connection: WsConnectionInterface;
  private refGenerator: EntityRefIdGenerator;

  constructor(
    private readonly connectionFactory: WsConnectionFactoryInterface,
    private readonly entityType: string,
    private readonly reviver: (key: any, value: any) => any,
  ) {
    this.setup();
  }

  add(entity: T): Observable<T> {
    const refId = this.refGenerator.next();

    const obs = new Subject<T>();

    const sub = this.connection.events()
      .pipe(
        filterEvent("entity-created", refId),
        filter(x => x.data.entityKind === this.entityType)
      )
      .subscribe(event => {
        const entity = event.data.entity as T;
        obs.next(this.revive(entity));
        obs.complete();

        // We no longer need to listen
        sub.unsubscribe();
      }, (error) => {
        obs.error(error);
        sub.unsubscribe();
      });

    this.connection.send("create-entity", {
      entity: entity,
      entityKind: this.entityType,
      refId: refId
    });

    return obs.asObservable();
  }

  update(entity: T): Observable<T> {
    const refId = this.refGenerator.next();
    const obs = new Subject<T>();

    const sub = this.connection.events()
      .pipe(
        filterEvent("entity-updated", refId),
        filter(x => x.data.entityKind === this.entityType)
      )
      .subscribe(event => {
        const entity = event.data.entity as T;
        obs.next(this.revive(entity));
        obs.complete();

        // We no longer need to listen
        sub.unsubscribe();
      }, (error) => {
        obs.error(error);
        sub.unsubscribe();
      });

    this.connection.send("update-entity", {
      entity: entity,
      entityKind: this.entityType,
      refId: refId
    });

    return obs;
  }

  remove(entity: T): Observable<void> {
    const refId = this.refGenerator.next();
    const obs = new Subject<void>();

    const sub = this.connection.events()
      .pipe(
        filterEvent("entity-deleted", refId),
        filter(x => x.data.entityKind === this.entityType)
      )
      .subscribe(() => {
        obs.next();
        obs.complete();

        // We no longer need to listen
        sub.unsubscribe();
      }, (error) => {
        obs.error(error);
        sub.unsubscribe();
      });

    this.connection.send("delete-entity", {
      uuid: entity.uuid,
      entityKind: this.entityType,
      refId: refId
    });

    return obs;
  }

  sync(): Observable<T[]> {
    const refId = this.refGenerator.next();
    const obs = new Subject<T[]>();

    const sub = this.connection.events()
      .pipe(
        filterEvent("entities-synced", refId),
        filter(x => x.data.entityKind === this.entityType)
      )
      .subscribe((event) => {
        const entities = event.data.entities as T[];
        const revivedEntities = entities.map((t) => this.revive(t));
        obs.next(revivedEntities);
        obs.complete();

        // We no longer need to listen
        sub.unsubscribe();
      }, (error) => {
        obs.error(error);
        sub.unsubscribe();
      });

    this.connection.send("sync-entities", {
      entityKind: this.entityType,
      refId: refId
    });

    return obs;
  }

  private setup() {
    this.connection = this.connectionFactory.create();
    this.refGenerator = this.connectionFactory.createRefId(this.entityType);
  }

  private revive(entity: T): T {
    if (!this.reviver) {
      return entity;
    }

    Object.getOwnPropertyNames(entity).forEach(prop => {
      if (prop === "uuid") {
        return;
      }
      entity[prop] = this.reviver(prop, entity[prop]);
    });

    return entity;
  }
}
