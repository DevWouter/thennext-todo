import { Observable, BehaviorSubject } from "rxjs";
import { map, share, tap, filter } from "rxjs/operators";
import { Entity } from "../../models/entity";
import { EntityMessageSenderInterface } from "./entity-message-sender";
import { EntityMessageReceiverInterface } from "./entity-message-receiver";

export class Repository<T extends Entity> {
  private readonly _entities: T[] = [];
  private readonly $entities = new BehaviorSubject<T[]>(this._entities);
  public readonly entities = this.$entities.asObservable();

  constructor(
    private readonly _send: EntityMessageSenderInterface<T>,
    private readonly _receive: EntityMessageReceiverInterface<T>,
  ) { this.setup(); }

  private setup() {
    this._receive.onAdd()
      .subscribe(event => {
        this._entities.push(event.data);
        this.$entities.next(this._entities);
      });

    this._receive.onUpdate()
      .pipe(
        // Determine the destination target
        map(x => ({
          src: x.data,
          dst: this._entities.find(y => y.uuid === x.data.uuid)
        })),
        filter(x => x.dst !== undefined)
      )
      .subscribe((event) => {
        const { src, dst } = event;

        // Assign values from src to dst
        Object.getOwnPropertyNames(src).forEach(prop => {
          dst[prop] = src[prop];
        });

        this.$entities.next(this._entities);
      });

    this._receive.onRemove()
      .pipe(
        map(x => this._entities.findIndex(y => y.uuid === x.uuid)),
        filter(x => x !== -1)
      )
      .subscribe(index => {
        this._entities.splice(index, 1);
        this.$entities.next(this._entities);
      });
  }

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
}
