import { Component, OnInit, Input } from "@angular/core";
import { TaskList, Task, ChecklistItem } from "../../models";

import { randomBytes, hash } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";
import { EncryptService } from "../../services/encrypt";
import { TaskService, ChecklistItemService } from "../../services";
import { take, tap, shareReplay, map, switchMap } from "rxjs/operators";
import { Observable, of, combineLatest, throwError } from "rxjs";

type ValidationRule = "WRONG_PK_ENCODING" | "WRONG_PK_LENGTH";

@Component({
  selector: "app-tasklist-settings-encrypt-panel",
  templateUrl: "./tasklist-settings-encrypt-panel.component.html",
  styleUrls: ["./tasklist-settings-encrypt-panel.component.scss"]
})
export class TasklistSettingsEncryptPanelComponent implements OnInit {

  validations: ValidationRule[] = [];

  @Input() tasklist: TaskList;
  privateKeyString: string;

  constructor(
    private readonly encryptService: EncryptService,
    private readonly taskService: TaskService,
    private readonly checklistItemService: ChecklistItemService,
  ) { }

  ngOnInit() {
  }

  save() {
    this.getEncrypted().subscribe();
  }

  getEncrypted(): Observable<[Uint8Array, TaskList, Task[], ChecklistItem[]]> {
    const $tasklist = of(this.tasklist);

    const $pk = of(this.privateKeyString).pipe(
      switchMap(x => {
        const validationFailures = this.encryptService.validatePrivateKey(x);
        if (validationFailures.length) {
          return throwError(new Error("PrivateKey is invalid: " + validationFailures.join(", ")));
        }
        return of(decodeBase64(x));
      }),
    );

    const $tasks = combineLatest($tasklist, this.taskService.entries).pipe(
      map(([tasklist, tasks]) => tasks.filter(task => task.taskListUuid === tasklist.uuid)),
      shareReplay(),
    );

    const $items = combineLatest($tasks, this.checklistItemService.entries).pipe(
      map(([tasks, items]) => {
        const taskUuids = tasks.map(x => x.uuid);
        return items.filter(item => taskUuids.includes(item.taskUuid));
      }),
    );

    const $result = combineLatest($pk, $tasklist, $tasks, $items).pipe(
      take(1),
      tap(([pk, tasklist, tasks, items]) => {
        this.encryptService.encryptTaskList(pk, tasklist, tasks, items);
      }),
      shareReplay(),
    );

    return $result;
  }

  generatePrivateKey(): void {
    const privateKey = randomBytes(32);
    this.privateKeyString = encodeBase64(privateKey);
  }
}
