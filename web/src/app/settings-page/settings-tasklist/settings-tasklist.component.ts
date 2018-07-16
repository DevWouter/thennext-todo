import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { combineLatest, Observable, pipe } from "rxjs";
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
  newToken = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private tasklistService: TaskListService,
    private tasklistRightService: TaskListRightService,
    private tasklistShareTokenService: TaskListShareTokenService,
  ) { }

  ngOnInit() {
    const $currentTaskListId = this.activatedRoute.params.pipe(map(p => p.uuid));
    const $currentTaskList = combineLatest(this.tasklistService.entries, $currentTaskListId)
      .pipe(map(([entries, uuid]) => entries.find(e => e.uuid === uuid)));

    $currentTaskList.subscribe(t => this.taskList = t);

    combineLatest($currentTaskList, this.tasklistRightService.entries)
      .pipe(map(([list, rights]) => rights.filter(r => r.taskListUuid === list.uuid)))
      .subscribe(t => this.rights = t);

    combineLatest($currentTaskList, this.tasklistShareTokenService.entries)
      .pipe(map(([list, tokens]) => tokens.filter(r => r.taskListUuid === list.uuid)))
      .subscribe(x => this.tokens = x)
      ;
  }

  delete(right: TaskListRight) {
    this.tasklistRightService.delete(right);
  }
  deleteToken(token: TaskListShareToken) {
    this.tasklistShareTokenService.delete(token);
  }

  addShareToken() {
    this.newToken = this.newToken.trim();
    // Don't allow empty tokens.
    if (this.newToken.length === 0) {
      return;
    }

    const newToken = <TaskListShareToken>{
      taskListUuid: this.taskList.uuid,
      token: this.newToken,
    };

    this.newToken = "";

    this.tasklistShareTokenService.add(newToken);
  }

}
