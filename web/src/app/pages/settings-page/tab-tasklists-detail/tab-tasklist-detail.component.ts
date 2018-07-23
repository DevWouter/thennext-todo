import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { TaskListService, TaskListRightService, TaskListShareTokenService } from '../../../services';
import { TaskList, TaskListRight, TaskListShareToken } from '../../../models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'settings-tab-tasklist-detail',
  templateUrl: './tab-tasklist-detail.component.html',
  styleUrls: ['./tab-tasklist-detail.component.scss']
})
export class SettingsTasklistDetailComponent implements OnInit {
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