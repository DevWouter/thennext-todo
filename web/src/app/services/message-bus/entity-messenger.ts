import { Entity } from "../../models/entity";
import { MessageBusInterface } from "./message-bus.service";
import { filter } from "rxjs/operators";
import { WsEventBasic } from "../ws/events";
import { EntityEventCallbacks, EntityEventCallbacksOptions } from "./entity-event-callbacks";

export class EntityMessenger<T extends Entity> {
  private _nextId = 0;
  private callbacks: EntityEventCallbacks<T>;
  constructor(
    private readonly entityKind: string,
    private readonly messageBus: MessageBusInterface,
  ) {
  }

  setup(callbacks: EntityEventCallbacks<T>) {
    if (this.callbacks) {
      throw new Error("EntityMessenger.setup can only be called once");
    }

    // Register the callback handler.
    this.callbacks = callbacks;

    this.messageBus.state.pipe(
      filter(x => x.connection.authenticated === true)
    ).subscribe(() => {
      this.messageBus.send("sync-entities", {
        entityKind: this.entityKind,
        refId: this.generateRefId()
      });
    });

    this.messageBus.addEventHandler("entities-synced", (data) => {
      this.callbacks.onEntitiesSynced(data.data.entities as T[], this.toOptions(data));
    });

    this.messageBus.addEventHandler("entity-created", (data) => {
      this.callbacks.onEntityCreated(data.data.entity as T, this.toOptions(data));
    });

    this.messageBus.addEventHandler("entity-updated", (data) => {
      this.callbacks.onEntityUpdated(data.data.entity as T, this.toOptions(data));
    });

    this.messageBus.addEventHandler("entity-deleted", (data) => {
      this.callbacks.onEntityDeleted(data.data.uuid, this.toOptions(data));
    });
  }

  sendCreate(entity: T): string {
    const refId = this.generateRefId();
    this.messageBus.send("create-entity", {
      entity: entity,
      entityKind: this.entityKind,
      refId: refId,
    });

    return refId;
  }

  private toOptions(data: WsEventBasic): EntityEventCallbacksOptions {
    return { echo: data.echo, refId: data.refId };
  }

  private generateRefId(): string {
    return `${this._nextId++}-${this.entityKind}-${Date.now()}-${Math.random()}`;
  }
}
