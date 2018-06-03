import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TaskList } from "../../services/models/task-list.dto";
import { TaskListService } from "../../services/task-list.service";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
// import { map } from "rxjs/operators";

@Component({
  selector: "app-settings-tasklist",
  templateUrl: "./settings-tasklist.component.html",
  styleUrls: ["./settings-tasklist.component.scss"]
})
export class SettingsTasklistComponent implements OnInit {
  taskList: TaskList;

  constructor(
    private tasklistService: TaskListService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    combineLatest(
      this.tasklistService.entries,
      this.activatedRoute.params.pipe(map(p => p.uuid)),
      (entries, uuid) => entries.find(e => e.uuid === uuid))
      .subscribe(t => this.taskList = t);
  }

  delete(tasklist: TaskList) {
    this.tasklistService.delete(tasklist);
  }

}
