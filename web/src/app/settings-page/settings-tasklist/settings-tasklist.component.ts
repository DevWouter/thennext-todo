import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TaskList } from "../../services/models/task-list.dto";
import { TaskListService } from "../../services/task-list.service";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { TaskListRightService } from "../../services/task-list-right.service";
import { TaskListRight } from "../../services/models/task-list-right.dto";

@Component({
  selector: "app-settings-tasklist",
  templateUrl: "./settings-tasklist.component.html",
  styleUrls: ["./settings-tasklist.component.scss"]
})
export class SettingsTasklistComponent implements OnInit {
  taskList: TaskList;
  rights: TaskListRight[] = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private tasklistService: TaskListService,
    private tasklistRightService: TaskListRightService,
  ) { }

  ngOnInit() {
    combineLatest(
      this.tasklistService.entries,
      this.activatedRoute.params.pipe(map(p => p.uuid)),
      (entries, uuid) => entries.find(e => e.uuid === uuid))
      .subscribe(t => this.taskList = t);

    combineLatest(
      this.tasklistService.entries,
      this.activatedRoute.params.pipe(map(p => p.uuid)),
      this.tasklistRightService.entries,
      (entries, uuid, rights) => {
        const list = entries.find(e => e.uuid === uuid);
        return rights
          .filter(r => r.taskListUuid === list.uuid)
          ;
      })
      .subscribe(t => this.rights = t);
  }

  delete(right: TaskListRight) {
    this.tasklistRightService.delete(right);
  }

}
