import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, timeout, tap } from "rxjs/operators";

import { Repository, RemoveOptions } from "./repository";
import { RepositoryEventHandler } from "./repository-event-handler";
import { EntityKind } from "../ws/entity-kind";
import { MessageService } from "../message.service";
import { CreateEntityCommand, UpdateEntityCommand, DeleteEntityCommand } from "../ws/commands";
import { environment } from "../../../environments/environment";
import { Entity } from "../../models/entity";

export class WsRepository<T extends Entity> implements Repository<T> {
  private _entries: T[] = [];
  private $entriesSubject = new BehaviorSubject<T[]>(undefined);
  private _nextId = 0;
  get entries(): Observable<T[]> { return this.$entriesSubject.pipe(filter(x => !!x)); }

  constructor(
    private readonly entityKind: EntityKind,
    private readonly messageService: MessageService,
    private eventHandler?: RepositoryEventHandler<T>,
  ) {
    this.messageService
      .eventsOf("entities-synced")
      .pipe(
        filter(x => x.data.entityKind === entityKind),
        map(x => x.data.entities as T[]),
        tap(x => {
          if (eventHandler) {
            x.forEach(y => eventHandler.onItemLoad(y));
          }
        })
      ).subscribe((entities) => {
        this._entries = entities;
        this.$entriesSubject.next(this._entries);
      });

    this.messageService.eventsOf("entity-updated")
      .pipe(
        filter(x => !x.echo),
        filter(x => x.data.entityKind === this.entityKind),
        map(x => {
          const t = x.data.entity as T;
          if (this.eventHandler) {
            this.eventHandler.onItemLoad(t);
          }

          return t;
        }),
    ).subscribe(src => {
      const dst = this._entries.find(x => x.uuid === src.uuid);
      if (!dst) {
        console.log(`Unable to find item with UUID ${src.uuid} so that it can update`, src);
        return;
      }

      // Copy the values.
      Object.getOwnPropertyNames(src).forEach(prop => {
        dst[prop] = src[prop];
      });

      this.$entriesSubject.next(this._entries);
    });

    this.messageService.eventsOf("entity-created")
      .pipe(
        filter(x => !x.echo),
        filter(x => x.data.entityKind === this.entityKind),
        map(x => {
          const t = x.data.entity as T;
          if (this.eventHandler) {
            this.eventHandler.onItemLoad(t);
          }

          return t;
        }),
    ).subscribe(src => {
      this._entries.push(src);
      this.$entriesSubject.next(this._entries);
    });

    this.messageService.eventsOf("entity-deleted")
      .pipe(
        filter(x => !x.echo),
        filter(x => x.data.entityKind === this.entityKind),
        map(x => x.data.uuid),
    ).subscribe(src => {
      const index = this._entries.findIndex(x => x.uuid === src);
      if (index === -1) {
        console.log(`Unable to find item with UUID ${src} so that it can be deleted`);
        return;
      }

      this._entries.splice(index, 1);
      this.$entriesSubject.next(this._entries);
    });
  }

  public load() {
    // Send sync command.
    this.messageService.send<"sync-entities">("sync-entities", {
      entityKind: this.entityKind,
      refId: this.generateRefId()
    });
  }

  public unload() {
    this._entries = [];
    this.$entriesSubject.next(this._entries);
  }

  private generateRefId(): string {
    return `${this._nextId++}-${this.entityKind}-${Date.now()}-${Math.random()}`;
  }

  private handleSelfCreatedEvent(
    data: T,
    success: (data: T) => void,
    failure: (reason) => void
  ) {
    const refId = this.generateRefId();
    const sub = this.messageService
      .eventsOf("entity-created")
      .pipe(
        timeout(environment.maxTimoutEntityCommandMs),
        filter(x => x.refId === refId),
        filter(x => x.data.entityKind === this.entityKind),
        map(x => x.data.entity as T),
    ).subscribe((v) => {
      sub.unsubscribe(); // Remove own subscription
      success(v);
    }, (error) => {
      sub.unsubscribe(); // Remove own subscription
      failure(error);
    });

    this.messageService.send("create-entity",
      <CreateEntityCommand>{
        entityKind: this.entityKind,
        entity: data,
        refId: refId
      });
  }

  private handleSelfUpdatedEvent(
    data: T,
    success: (data: T) => void,
    failure: (reason) => void,
  ) {
    const refId = this.generateRefId();
    const sub = this.messageService
      .eventsOf("entity-updated")
      .pipe(
        timeout(environment.maxTimoutEntityCommandMs),
        filter(x => x.refId === refId),
        filter(x => x.data.entityKind === this.entityKind),
        map(x => x.data.entity as T),
    ).subscribe((v) => {
      sub.unsubscribe(); // Remove own subscription
      success(v);
    }, (error) => {
      sub.unsubscribe(); // Remove own subscription
      failure(error);
    });

    this.messageService.send("update-entity",
      <UpdateEntityCommand>{
        entityKind: this.entityKind,
        entity: data,
        refId: refId
      });
  }

  private handleSelfDeletedEvent(
    data: T,
    success: (data: T) => void,
    failure: (reason) => void,
  ) {
    const refId = this.generateRefId();
    const sub = this.messageService
      .eventsOf("entity-deleted")
      .pipe(
        timeout(environment.maxTimoutEntityCommandMs),
        filter(x => x.refId === refId),
        filter(x => x.data.entityKind === this.entityKind),
        filter(x => x.data.uuid === data.uuid),
    ).subscribe((v) => {
      sub.unsubscribe(); // Remove own subscription
      success(data);
    }, (error) => {
      sub.unsubscribe(); // Remove own subscription
      failure(error);
    });

    this.messageService.send("delete-entity",
      <DeleteEntityCommand>{
        entityKind: this.entityKind,
        refId: refId,
        uuid: data.uuid,
      });
  }

  async add(value: T): Promise<T> {
    // Returns only when it has a reply.
    return new Promise<T>((resolve, reject) => {
      const onSuccess = (reply: T) => {
        value.uuid = reply.uuid;
        this._entries.push(value);
        this.$entriesSubject.next(this._entries);
        resolve(value);
      };

      const onFailure = (reason) => {
        console.log("I got an error");
        reject(reason);
      };

      this.handleSelfCreatedEvent(value, onSuccess, onFailure);
    });
  }

  async update(value: T): Promise<T> {
    // Returns only when it has a reply.
    return new Promise<T>((resolve, reject) => {
      const onSuccess = (reply: T) => {
        resolve(value);
      };

      const onFailure = (reason) => {
        reject(reason);
      };

      this.handleSelfUpdatedEvent(value, onSuccess, onFailure);

      // Fire entries subject to ensure that all components detect the updated entry
      this.$entriesSubject.next(this._entries);
    });
  }

  async delete(value: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const onSuccess = (reply: T) => {
        this.removeMany([value], { onlyInternal: true });
        resolve(value);
      };

      const onFailure = (reason) => {
        reject(reason);
      };

      this.handleSelfDeletedEvent(value, onSuccess, onFailure);
    });
  }

  async removeMany(values: T[], options?: RemoveOptions): Promise<T[]> {
    options = options || { onlyInternal: false };
    if (!options.onlyInternal) {
      // Delete each value.
      return await Promise.all(values.map(x => this.delete(x)));
    } else {
      const removed: T[] = [];
      values.forEach(x => {
        const index = this._entries.indexOf(x);
        if (index === -1) {
          console.warn("The following object could not be found in the repository", x);
          return;
        }

        this._entries.splice(index, 1);
        removed.push(x);
      });

      if (removed.length) {
        this.$entriesSubject.next(this._entries);
      }

      return removed;
    }
  }
}
