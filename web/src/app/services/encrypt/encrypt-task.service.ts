import { Injectable } from '@angular/core';
import { Task } from '../../models';

import { randomBytes, secretbox } from "tweetnacl";
import { encodeBase64 } from "tweetnacl-util";


@Injectable({
  providedIn: 'root'
})
export class EncryptTaskService {
  constructor() { }

  encrypt(pk: Uint8Array, task: Task): void {
    if (task.pkNonce) {
      throw new Error("task already has pkNonce set and can not be encrypted again");
    }

    const pkNonce = randomBytes(24);

    task.title = this.encryptText(task.title, pkNonce, pk);
    task.description = this.encryptText(task.description, pkNonce, pk);
    task.pkNonce = encodeBase64(pkNonce);
  }

  private encryptText(text: string, pkNonce: Uint8Array, pk: Uint8Array): string {
    const encoder = new TextEncoder();
    return encodeBase64(secretbox(encoder.encode(text), pkNonce, pk));
  }
}
