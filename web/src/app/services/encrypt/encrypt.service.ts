import { Injectable } from '@angular/core';

import { randomBytes, secretbox, hash } from "tweetnacl";
import { decodeBase64, encodeBase64 } from "tweetnacl-util";

import { TaskList, Task, ChecklistItem } from '../../models';

// Internal services
import { EncryptKeysStorageService } from './encrypt-keys-storage.service';

type ValidationRule = "WRONG_PK_ENCODING" | "WRONG_PK_LENGTH";

@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  constructor(
    private readonly tasklistKeysService: EncryptKeysStorageService
  ) { }

  validatePrivateKey(pk: string): ValidationRule[] {
    return [
      Validate(() => decodeBase64(pk) && true, "WRONG_PK_ENCODING"),
      Validate(() => decodeBase64(pk).length === 32, "WRONG_PK_LENGTH"),
    ].filter(x => x !== undefined);
  }

  encryptTaskList(
    privateKey: Uint8Array,
    list: TaskList,
    tasks: Task[],
    checklistItems: ChecklistItem[],
  ): void {
    if (tasks.some(x => x.taskListUuid !== list.uuid)) {
      throw new Error("Task unrelated to the tasklist cannot be encrypted with given tasklist");
    }

    if (checklistItems.some(item => tasks.findIndex(x => x.uuid === item.taskUuid) === -1)) {
      throw new Error("ChecklistItem unrelated to the tasklist cannot be encrypted with given tasklist");
    }

    tasks.forEach(task => this.encryptTask(privateKey, task, checklistItems));
    list.privateKeyHash = encodeBase64(hash(privateKey));
    this.tasklistKeysService.set(list.uuid, privateKey);
  }


  encryptTask(pk: Uint8Array, task: Task, checklistItems: ChecklistItem[]): void {
    if (task.pkNonce) {
      throw new Error("task already has pkNonce set and can not be encrypted again");
    }

    const pkNonce = randomBytes(24);

    task.title = this.encryptText(task.title, pkNonce, pk);
    task.description = this.encryptText(task.description, pkNonce, pk);
    task.pkNonce = encodeBase64(pkNonce);

    checklistItems.forEach(item => this.encryptChecklistItem(pk, pkNonce, item));
  }

  encryptChecklistItem(pk: Uint8Array, taskNonce: Uint8Array, checklistItem: ChecklistItem): void {
    checklistItem.title = this.encryptText(checklistItem.title, taskNonce, pk);
  }

  private encryptText(text: string, pkNonce: Uint8Array, pk: Uint8Array): string {
    const encoder = new TextEncoder();
    return encodeBase64(secretbox(encoder.encode(text), pkNonce, pk));
  }
}

// HELPER FUNCTION
function Validate(test: () => boolean, validationRule: ValidationRule) {
  try {
    if (!test()) { return validationRule; }
  } catch {
    return validationRule;
  }

  return undefined;
}
