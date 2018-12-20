import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncryptKeysStorageService } from './encrypt-keys-storage.service';
import { EncryptTasklistService } from './encrypt-tasklist.service';
import { EncryptTaskService } from './encrypt-task.service';


@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [
    EncryptKeysStorageService,
    EncryptTasklistService,
    EncryptTaskService,
  ],
})
export class EncryptModule { }
