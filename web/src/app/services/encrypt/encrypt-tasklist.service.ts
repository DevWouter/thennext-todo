import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, take, share, map } from 'rxjs/operators';

import { decodeBase64 } from "tweetnacl-util";
import { TaskList, Task } from '../../models';
import { TaskService } from '../task.service';

// Internal services
import { EncryptTaskService } from './encrypt-task.service';
import { EncryptKeysStorageService } from './encrypt-keys-storage.service';

type ValidationRule = "WRONG_PK_ENCODING" | "WRONG_PK_LENGTH";

@Injectable({
  providedIn: 'root'
})
export class EncryptTasklistService {

  constructor(
    private readonly tasklistKeysService: EncryptKeysStorageService,
    private readonly taskEncryptService: EncryptTaskService,
    private readonly taskService: TaskService,
  ) { }

  validatePrivateKey(pk: string): ValidationRule[] {
    return [
      Validate(() => decodeBase64(pk) && true, "WRONG_PK_ENCODING"),
      Validate(() => decodeBase64(pk).length === 32, "WRONG_PK_LENGTH"),
    ].filter(x => x !== undefined);
  }

  encrypt(list: TaskList, privateKeyString: string): Observable<Task[]> {
    const pk = decodeBase64(privateKeyString);
    this.tasklistKeysService.set(list.uuid, pk);
    return this.taskService.entries.pipe(
      map(tasks => tasks.filter(task => task.taskListUuid === list.uuid)),
      tap(tasks => { tasks.forEach(task => this.taskEncryptService.encrypt(pk, task)); }),
      take(1),
      share());
  }
}

// HELPER FUNCTION
function Validate(test: () => boolean, validationRule: ValidationRule) {
  try {
    if (test()) {
      return undefined;
    }
    return validationRule;
  } catch {
    return validationRule;
  }
}
