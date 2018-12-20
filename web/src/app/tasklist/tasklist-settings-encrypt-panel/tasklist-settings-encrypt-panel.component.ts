import { Component, OnInit, Input } from '@angular/core';
import { TaskList } from '../../models';

import { randomBytes, hash } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";
import { EncryptService } from '../../services/encrypt';

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
    private readonly encryptService: EncryptService,
  ) { }

  ngOnInit() {
  }

  save(): any {
    this.validations = this.encryptService.validatePrivateKey(this.privateKeyString);
    if (this.validations.length) {
      return;
    }

    const pk = decodeBase64(this.privateKeyString);

    this.encryptService.encryptTaskList(pk, this.tasklist, [], []);
  }

  generatePrivateKey(): void {
    const privateKey = randomBytes(32);
    this.privateKeyString = encodeBase64(privateKey);
  }
}
