import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { StorageService } from "../storage.service";
import { Repository, Entry, EntryState } from "./repository";
import { ApiService } from "../api.service";
import { Entity } from "./entity";
import { ApiResource } from "./api-resource";
import { RepositoryRestoreTranslator } from "./repository-restore-translator";

export class ApiRepository<T extends Entity> implements Repository<T> {
  private _apiResource: ApiResource<T>;
  private _entries: Entry<T>[] = undefined;
  private _entriesSubject = new BehaviorSubject<T[]>(undefined);
  get entries(): Observable<T[]> { return this._entriesSubject.filter(x => !!x); }

  constructor(
    private apiService: ApiService,
    private resourcePath: string,
    private translator?: RepositoryRestoreTranslator<T>,
  ) {
    this._apiResource = new ApiResource(apiService, resourcePath);
    this.initialLoad();
  }

  add(value: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!this._entries) {
        return reject(new Error("This repository has no been initialized"));
      }

      // Reject if we already have an entry.
      // Check if we have the item
      const entry = this._entries.find(_ => _.value === value);
      if (entry) {
        return reject(new Error("This repository already has added this entry, don't add an entry more than once"));
      }

      // Add the item to the list.
      this._entries.push(new Entry(value, EntryState.Added));

      // Inform the caller that entries was added but only when it was saved.
      this.save()
        .then(() => this.updateSubject())
        .then(() => resolve(value))
        .catch(reason => reject(reason));
    });
  }

  update(value: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!this._entries) {
        return reject(new Error("This container has no been initialized"));
      }

      // Check if we have the item
      const entry = this._entries.find(_ => _.value === value);
      if (!entry) {
        return reject(new Error("This repository does not contain the entry, add it first"));
      }

      // Inform everyone that the entry has been updated.
      entry.state = EntryState.Updated;

      // Inform the caller that entries was updated but only after it was saved.
      this.save()
        .then(() => this.updateSubject())
        .then(() => resolve(value))
        .catch(reason => reject(reason));
    });
  }

  delete(value: T): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (!this._entries) {
        return reject(new Error("This container has no been initialized"));
      }

      // Check if we have the item
      const entry = this._entries.find(_ => _.value === value);
      if (!entry) {
        return reject(new Error("This repository does not contain the entry, add it first"));
      }

      // Mark the entry as deleted.
      entry.state = EntryState.Deleted;

      // Inform the caller that entries was deleted but only when it was saved.
      // The save function is responsible for removing it.
      this.save()
        .then(() => this.updateSubject())
        .then(() => resolve(value))
        .catch(reason => reject(reason));
    });
  }

  deleteMany(values: T[]): Promise<T[]> {
    if (values === null || values === undefined || values.length === 0) {
      // No values, nothing to resolve.
      return Promise.resolve([]);
    }

    return new Promise<T[]>((resolve, reject) => {
      if (!this._entries) {
        return reject(new Error("This container has no been initialized"));
      }

      // Find the entries we need to delete
      const entriesToDelete = this._entries.filter(entry => values.includes(entry.value));
      entriesToDelete.forEach(entry => entry.state = EntryState.Deleted);

      // Inform the caller that entries was deleted but only when it was saved.
      // The save function is responsible for removing it.
      this.save()
        .then(() => this.updateSubject())
        .then(() => resolve(values))
        .catch(reason => reject(reason));
    });
  }

  public addMany(values: T[]): Promise<T[]> {
    if (values === null || values === undefined || values.length === 0) {
      // No values, nothing to resolve.
      return Promise.resolve([]);
    }

    return new Promise<T[]>((resolve, reject) => {
      if (!this._entries) {
        return reject(new Error("This repository has no been initialized"));
      }

      // Remove items that were already added
      const newValues = values.filter(value => this._entries.every(y => y.value !== value));
      const newEntries = newValues.map(value => new Entry(value, EntryState.Added));

      this._entries.push(...newEntries);

      // Inform the caller that entries was added but only when it was saved.
      this.save()
        .then(() => this.updateSubject())
        .then(() => resolve(newValues))
        .catch(reason => reject(reason));
    });
  }

  private updateSubject(): void {
    const elements = this._entries
      .filter(_ => _.state !== EntryState.Deleted)
      .map(_ => _.value);
    this._entriesSubject.next(elements);
  }

  private save(): Promise<void> {
    return this.saveToStorage();
  }

  private initialLoad(): void {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    this._apiResource.index().subscribe(items => {
      if (items) {
        if (this.translator) {
          items.forEach(item => this.translator.translate(item));
        }
        this._entries = items.map(item => new Entry(item, EntryState.Unchanged));
      } else {
        // No entries found, use an empty array.
        this._entries = [];
      }

      this.updateSubject();
    });
  }

  private saveToStorage(): Promise<void> {
    this._entries.filter(x => x.state !== EntryState.Unchanged);

    // Determine the elements we want to save.
    const elements = this._entries
      .filter(_ => _.state !== EntryState.Deleted)
      .map(_ => _.value);

    const createdElements = this._entries.filter(_ => _.state === EntryState.Added);
    const updatedElements = this._entries.filter(_ => _.state === EntryState.Updated);
    const deletedElements = this._entries.filter(_ => _.state === EntryState.Deleted);

    let promise = Promise.resolve({});
    createdElements.map(_ => _.value).forEach(value => {
      promise = promise.then(() => {
        return new Promise((_resolve, _reject) => {
          this._apiResource.create(value).subscribe(_ => {
            value.uuid = _.uuid;
            setTimeout(() => {
              _resolve();
            }, 100);
          }, _reject);
        });
      });
    });

    updatedElements.map(_ => _.value).forEach(value => {
      promise = promise.then(() => {
        return new Promise((_resolve, _reject) => {
          this._apiResource.update(value).subscribe(_ => _resolve(), _reject);
        });
      });
    });

    deletedElements.map(_ => _.value).forEach(value => {
      promise = promise.then(() => {
        return new Promise((_resolve, _reject) => {
          this._apiResource.destroy(value).subscribe(_ => _resolve(), _reject);
        });
      });
    });

    // Handlers.
    const removeDeleteItemsHandler = () => {
      deletedElements.forEach(item => {
        const pos = this._entries.indexOf(item);
        this._entries.splice(pos, 1);
      });
    };

    const setAllEntriesToUnchangedHandler = () => {
      this._entries.forEach(x => x.state = EntryState.Unchanged);
    };

    return promise
      .then(removeDeleteItemsHandler)
      .then(setAllEntriesToUnchangedHandler);
  }
}
