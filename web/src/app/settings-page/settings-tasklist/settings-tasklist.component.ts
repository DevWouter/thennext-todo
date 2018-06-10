import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { TaskList } from "../../services/models/task-list.dto";
import { TaskListRight } from "../../services/models/task-list-right.dto";

import { TaskListService } from "../../services/task-list.service";
import { TaskListRightService } from "../../services/task-list-right.service";
import { TaskListShareTokenService } from "../../services/task-list-share-token.service";
import { TaskListShareToken } from "../../services/models/task-list-share-token.dto";

@Component({
  selector: "app-settings-tasklist",
  templateUrl: "./settings-tasklist.component.html",
  styleUrls: ["./settings-tasklist.component.scss"]
})
export class SettingsTasklistComponent implements OnInit {
  taskList: TaskList;
  rights: TaskListRight[] = undefined;
  tokens: TaskListShareToken[] = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private tasklistService: TaskListService,
    private tasklistRightService: TaskListRightService,
    private tasklistShareTokenService: TaskListShareTokenService,
  ) { }

  ngOnInit() {
    const taskListObservable = combineLatest(
      this.tasklistService.entries,
      this.activatedRoute.params.pipe(map(p => p.uuid)),
      (entries, uuid) => entries.find(e => e.uuid === uuid));

    taskListObservable.subscribe(t => this.taskList = t);

    combineLatest(
      taskListObservable,
      this.tasklistRightService.entries,
      (list, rights) => rights.filter(r => r.taskListUuid === list.uuid))
      .subscribe(t => this.rights = t);

    combineLatest(
      taskListObservable,
      this.tasklistShareTokenService.entries,
      (list, tokens) => tokens.filter(r => r.taskListUuid === list.uuid))
      .subscribe(x => this.tokens = x)
      ;
  }

  delete(right: TaskListRight) {
    this.tasklistRightService.delete(right);
  }
  deleteToken(token: TaskListShareToken) {
    this.tasklistShareTokenService.delete(token);
  }

  addShareToken(amount: number) {
    for (let i = 0; i < amount; ++i) {
      const newToken = <TaskListShareToken>{
        taskListUuid: this.taskList.uuid,
      };

      this.tasklistShareTokenService.add(newToken);
    }
  }

}
