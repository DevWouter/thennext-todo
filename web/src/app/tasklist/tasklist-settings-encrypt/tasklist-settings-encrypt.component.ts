import { Component, OnInit, Input } from '@angular/core';
import { TaskList } from '../../models';

import * as nacl from "tweetnacl";
import { encodeBase64 } from "tweetnacl-util";
import { map, filter } from 'rxjs/operators';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { TasklistPrivateKey, EncryptKeysStorageService } from '../../services/encrypt';

type Panel = "encrypt" | "key-input" | "decrypt";

@Component({
  selector: 'app-tasklist-settings-encrypt',
  templateUrl: './tasklist-settings-encrypt.component.html',
  styleUrls: ['./tasklist-settings-encrypt.component.scss']
})
export class TasklistSettingsEncryptComponent implements OnInit {

  private _tasklist: TaskList;
  private $tasklist = new BehaviorSubject<TaskList>(this._tasklist);
  public get tasklist(): TaskList {
    return this._tasklist;
  }
  @Input() public set tasklist(v: TaskList) {
    this._tasklist = v;
    this.$tasklist.next(v);
  }

  $privateKey: Observable<TasklistPrivateKey>;
  $panel: Observable<Panel>;

  constructor(
    private readonly tasklistKeysService: EncryptKeysStorageService
  ) { }

  ngOnInit() {
    this.$privateKey = combineLatest(
      this.tasklistKeysService.privateKeys,
      this.$tasklist.pipe(filter(x => !!x)),
    ).pipe(
      map(([keys, list]) => keys.find(key => key.tasklistGuid === list.uuid))
    );

    this.$panel = combineLatest(
      this.$privateKey,
      this.$tasklist.pipe(filter(x => !!x)),
    ).pipe(
      map(([pk, list]) => {
        if (pk) {
          return <Panel>"decrypt";
        }

        if (list.privateKeyHash) {
          return <Panel>"key-input";
        }

        return <Panel>"encrypt";
      })
    );
  }

}
