import { BehaviorSubject, Observable, Subject } from "rxjs";
import { EntityEventCallbacks, EntityEventCallbacksOptions } from "./entity-event-callbacks";
import { Entity } from "../../models/entity";
import { EntityMessenger } from "./entity-messenger";
import { filter, tap, map } from "rxjs/operators";

export interface RepositoryEventHandler<T extends Entity> {
  onRevive(item: T): void;
}

export class Repository<T extends Entity> implements EntityEventCallbacks<T> {

  private _entries: T[] = [];
  private $entries = new BehaviorSubject<T[]>(this._entries);
  get entries(): Observable<T[]> { return this.$entries; }

  private $serverMessages = new BehaviorSubject<EntityEventCallbacksOptions & { data: Entity }>(undefined);

  constructor(
    private readonly eventHandler: Partial<RepositoryEventHandler<T>>,
    private readonly messenger: EntityMessenger<T>,
  ) {
    messenger.setup(this);
  }

  async add(entity: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const refId = this.messenger.sendCreate(entity);
      // Wait for server response.
      const sub = this.$serverMessages
        .pipe(
          filter(x => x !== undefined),
          filter(x => x.refId === refId),
          map(x => x as (EntityEventCallbacksOptions & { data: Entity })),
          map(x => x.data.uuid),
        )
        .subscribe(x => {
          entity.uuid = x;
          sub.unsubscribe();
          resolve(entity);
        });
    });
  }

  onEntitiesSynced(entities: T[], options: EntityEventCallbacksOptions) {
    entities.forEach(x => this.onRevive(x));

    // Replace the entire array.
    this._entries.splice(0, this._entries.length, ...entities);
    this.updateEntries();
  }

  onEntityCreated(entity: T, options: EntityEventCallbacksOptions) {
    if (options.echo) {
      console.log("Get an echoed response, moving it to the server messages");
      this.$serverMessages.next({ ...options, ...{ data: entity } });
      return;
    }

    // Check if entity is already listed and if so perform an early out.
    const alreadyAdded = this._entries.some(x => x.uuid === entity.uuid);
    if (alreadyAdded) {
      return;
    }

    this.onRevive(entity);
    this._entries.push(entity);
    this.updateEntries();
  }

  onEntityUpdated(entity: T, options: EntityEventCallbacksOptions) {
    const index = this._entries.findIndex(x => x.uuid === entity.uuid);
    if (index === -1) {
      return;
    }

    this.onRevive(entity);

    this._entries.splice(index, 1, entity);
    this.updateEntries();
  }

  onEntityDeleted(uuid: string, options: EntityEventCallbacksOptions) {
    const index = this._entries.findIndex(x => x.uuid === uuid);
    if (index === -1) {
      return;
    }

    this._entries.splice(index, 1);
    this.updateEntries();
  }

  private updateEntries() {
    this.$entries.next(this._entries);
  }

  private onRevive(entity: T): void {
    const originalUuid = entity.uuid;
    this.eventHandler.onRevive && this.eventHandler.onRevive(entity);
    if (originalUuid !== entity.uuid) {
      throw new Error("The `onRevive` of the EventHandler is not allowed to change the uuid of an entity");
    }
  }
}
