import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";

import { TaskListService } from "../../../services";
import { TaskList } from "../../../models";

@Component({
  selector: "settings-tab-tasklist-detail",
  templateUrl: "./tab-tasklist-detail.component.html",
  styleUrls: ["./tab-tasklist-detail.component.scss"]
})
export class SettingsTasklistDetailComponent implements OnInit {
  taskList: TaskList;
  newName = "";
  constructor(
    private activatedRoute: ActivatedRoute,
    private tasklistService: TaskListService,
  ) { }

  ngOnInit() {
    const $currentTaskListId = this.activatedRoute.params.pipe(map(p => p.uuid));
    const $currentTaskList = combineLatest(this.tasklistService.entries, $currentTaskListId)
      .pipe(map(([entries, uuid]) => entries.find(e => e.uuid === uuid)));

    $currentTaskList.subscribe(t => {
      this.taskList = t;
      this.newName = t.name;
    });
  }

  updateName() {
    if (this.newName === null || this.newName === undefined || this.newName.trim().length === 0) {
      return;
    }

    this.taskList.name = this.newName;
    this.tasklistService.update(this.taskList);
    // this.newName
  }
}
