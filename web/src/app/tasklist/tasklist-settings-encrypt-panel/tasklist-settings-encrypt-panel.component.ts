import { Component, OnInit, Input } from '@angular/core';
import { TaskList } from '../../models';

import { randomBytes, hash } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";
import { EncryptTasklistService } from '../../services/encrypt';

type ValidationRule = "WRONG_PK_ENCODING" | "WRONG_PK_LENGTH";

@Component({
  selector: 'app-tasklist-settings-encrypt-panel',
  templateUrl: './tasklist-settings-encrypt-panel.component.html',
  styleUrls: ['./tasklist-settings-encrypt-panel.component.scss']
})
export class TasklistSettingsEncryptPanelComponent implements OnInit {

  validations: ValidationRule[] = [];

  @Input() tasklist: TaskList;
  privateKeyString: string;

  constructor(
    private readonly tasklistEncryptService: EncryptTasklistService,
  ) { }

  ngOnInit() {
  }

  save(): any {
    this.validations = this.tasklistEncryptService.validatePrivateKey(this.privateKeyString);
    if (this.validations.length) {
      return;
    }

    this.tasklistEncryptService.encrypt(this.tasklist, this.privateKeyString)
  }

  generatePrivateKey(): void {
    const privateKey = randomBytes(32);
    this.privateKeyString = encodeBase64(privateKey);
  }
}
