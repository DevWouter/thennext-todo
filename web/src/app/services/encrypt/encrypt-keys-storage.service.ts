import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

import { decodeBase64, encodeBase64 } from "tweetnacl-util";

import { StorageService } from "../storage.service";
import { TasklistEventService } from "../tasklist";

import { TasklistPrivateKey } from "./models";

const STORAGE_KEY = "tasklist-private-keys";

@Injectable({
  providedIn: "root"
})
export class EncryptKeysStorageService {

  private readonly _privateKeys: TasklistPrivateKey[] = [];
  private readonly $privateKeys = new BehaviorSubject<TasklistPrivateKey[]>(this._privateKeys);

  public get privateKeys(): Observable<TasklistPrivateKey[]> { return this.$privateKeys; }

  constructor(
    private readonly tasklistEventService: TasklistEventService,
    private readonly storage: StorageService,
  ) {
    try {
      this.loadFromStorage();
    } catch {
      this.storage.del(STORAGE_KEY);
    }

    this.tasklistEventService.deletedTasklist.subscribe(x => {
      this.unset(x.uuid);
    });
  }

  loadFromStorage(): void {
    const storedPrivateKeysJson = this.storage.get(STORAGE_KEY);
    if (!!storedPrivateKeysJson) {
      const storedPrivateKeys = JSON.parse(storedPrivateKeysJson, (k, v) => {
        if (k === "privateKey") {
          return decodeBase64(v);
        }
        return v;
      });
      this._privateKeys.push(...storedPrivateKeys);
      this.$privateKeys.next(this._privateKeys);
    }
  }

  set(tasklistGuid: string, privateKey: Uint8Array): void {
    const newEntry = {
      tasklistGuid: tasklistGuid,
      privateKey: privateKey,
    };
    const index = this._privateKeys.findIndex(x => x.tasklistGuid === tasklistGuid);

    if (index === -1) {
      this._privateKeys.push(newEntry);
    } else {
      this._privateKeys.splice(index, 1, newEntry);
    }

    this.$privateKeys.next(this._privateKeys);
    this.save();
  }

  unset(tasklistGuid: string): void {
    const index = this._privateKeys.findIndex(x => x.tasklistGuid === tasklistGuid);
    if (index === -1) {
      // Nothing to remove.
      return;
    }
    this._privateKeys.splice(index, 1);
    this.$privateKeys.next(this._privateKeys);
    this.save();
  }

  private save() {
    const to_store_json = JSON.stringify(this._privateKeys.map(x => {
      return {
        privateKey: encodeBase64(x.privateKey),
        tasklistGuid: x.tasklistGuid,
      };
    }));

    this.storage.set(STORAGE_KEY, to_store_json);
  }

}
