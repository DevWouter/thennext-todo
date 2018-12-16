import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Observable, Subscription } from "rxjs";
import { map, filter } from "rxjs/operators";

import { TaskListService } from "../../../services";
import { TaskList } from "../../../models";

@Component({
  selector: "settings-tab-tasklist-detail",
  templateUrl: "./tab-tasklist-detail.component.html",
  styleUrls: ["./tab-tasklist-detail.component.scss"]
})
export class SettingsTasklistDetailComponent implements OnInit, OnDestroy {
  private _subs: Subscription[] = [];
  _taskList: TaskList;
  newName = "";
  $taskList: Observable<TaskList>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private tasklistService: TaskListService,
  ) { }

  ngOnInit() {
    const $currentTaskListId = this.activatedRoute.params.pipe(map(p => p.uuid));
    const $currentTaskList = combineLatest(this.tasklistService.entries.pipe(filter(x => !!x)), $currentTaskListId)
      .pipe(
        map(([entries, uuid]) => entries.find(e => e.uuid === uuid)),
        filter(x => !!x)
      );

    this.$taskList = $currentTaskList;

    this._subs.push($currentTaskList.subscribe(t => {
      this._taskList = t;
      this.newName = t.name;
    }));
  }

  ngOnDestroy(): void {
    this._subs.forEach(x => x.unsubscribe());
    this._subs = [];
  }

  updateName() {
    if (this.newName === null || this.newName === undefined || this.newName.trim().length === 0) {
      return;
    }

    this._taskList.name = this.newName;
    this.tasklistService.update(this._taskList);
  }
}
