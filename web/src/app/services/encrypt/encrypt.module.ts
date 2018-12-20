import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EncryptKeysStorageService } from './encrypt-keys-storage.service';
import { EncryptService } from './encrypt.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [
    EncryptKeysStorageService,
    EncryptService,
  ],
})
export class EncryptModule { }
