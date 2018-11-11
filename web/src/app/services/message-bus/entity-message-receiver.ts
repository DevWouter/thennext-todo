import { Entity } from "../../models/entity";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { WsEvent } from "../ws/events";
import { WsConnectionInterface } from "./ws-connection";

export interface EntityMessageReceiverInterface<T extends Entity> {
  onAdd(): Observable<{ data: T }>;
  onUpdate(): Observable<{ data: T }>;
  onRemove(): Observable<{ uuid: string }>;
}

export class EntityMessageReceiver<T extends Entity> implements EntityMessageReceiverInterface<T> {
  private $add: Observable<{ data: T; }>;
  private $update: Observable<{ data: T; }>;
  private $remove: Observable<{ uuid: string; }>;

  constructor(
    private readonly connection: WsConnectionInterface,
    private readonly entityType: string,
    private readonly reviver: (key: any, value: any) => any,
  ) {
    this.setup();
  }

  onAdd(): Observable<{ data: T; }> {
    return this.$add;
  }

  onUpdate(): Observable<{ data: T; }> {
    return this.$update;
  }

  onRemove(): Observable<{ uuid: string; }> {
    return this.$remove;
  }

  private setup(): any {
    this.$add = this.connection.events()
      .pipe(
        filter(x => x.echo === false),
        filter(x => x.type === "entity-created"),
        map(x => x as WsEvent<"entity-created">),
        filter(x => x.data.entityKind === this.entityType),
        map(x => ({ data: this.revive(x.data.entity as T) }))
      );

    this.$update = this.connection.events()
      .pipe(
        filter(x => x.echo === false),
        filter(x => x.type === "entity-updated"),
        map(x => x as WsEvent<"entity-updated">),
        filter(x => x.data.entityKind === this.entityType),
        map(x => ({ data: this.revive(x.data.entity as T) }))
      );

    this.$remove = this.connection.events()
      .pipe(
        filter(x => x.echo === false),
        filter(x => x.type === "entity-deleted"),
        map(x => x as WsEvent<"entity-deleted">),
        filter(x => x.data.entityKind === this.entityType),
        map(x => ({ uuid: x.data.uuid }))
      );
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
