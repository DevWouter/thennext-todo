import { Observable } from "rxjs";

/**
 * The various state an entry can be in.
 */
export enum EntryState {
  Unchanged = "unchanged",
  Added = "added",
  Updated = "updated",
  Deleted = "deleted",
}

/**
 * A class that can be used to keep track of the state of various elements.
 */
export class Entry<T> {
  /**
   * The value
   */
  readonly value: T;

  /**
   * The state of the entry. Can be updated.
   */
  state: EntryState;

  /**
   * The constructor for an entry.
   * @param entry The entry that represent this entry.
   * @param state The initial state of the object.
   */
  constructor(entry: T, state: EntryState) {
    this.value = entry;
    this.state = state;
  }
}

/**
 * An interface that can be used for a collection of elements.
 * NOTE: This is not part of `Repository<T>` since we might have readonly repositories.
 */
export interface RepositoryView<T> {
  /**
   * All the available entries.
   * It would be best if this is initialized as `BehaviorSubject` that holds undefined.
   * That way the subscribers can use `.filter(...)` to check if there is data.
   */
  readonly entries: Observable<T[]>;
}

export interface RemoveOptions {
  readonly onlyInternal?: boolean;
}

/**
 * An interface that acts as a template for all data service.
 * This is to ensure all data-classes work in the same way.
 */
export interface Repository<T> extends RepositoryView<T> {
  /**
   * Adds an value to the storage.
   * It will return a promise which will be resolved once the value has been added.
   * The value might be altered while in the repository.
   * @param value The value that needs to be added.
   */
  add(value: T): Promise<T>;

  /**
   * Updates an value
   * It will return a promise which will be resolved once the value has been deleted.
   * Only when the repository has no more changes for the `value` the `entries` is updated.
   * @param value The value that needs to be updated.
   */
  update(value: T): Promise<T>;

  /**
   * Delete an value
   * It will return a promise which will be resolved once the value has been deleted.
   * The value might be altered inside this function.
   * @param value The value that needs to be deleted.
   */
  delete(value: T): Promise<T>;

  /**
   * Deletes many values
   * It will return a promisewhich will be resolved once all the values have been deleted.
   * The values might be altered inside this function.
   * @param values The values that need to be deleted.
   */
  removeMany(values: T[], options?: RemoveOptions): Promise<T[]>;
}
