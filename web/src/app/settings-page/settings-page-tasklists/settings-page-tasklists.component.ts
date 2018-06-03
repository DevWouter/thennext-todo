import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TaskList } from "../../services/models/task-list.dto";
import { TaskListService } from "../../services/task-list.service";

@Component({
  selector: "app-settings-page-tasklists",
  templateUrl: "./settings-page-tasklists.component.html",
  styleUrls: ["./settings-page-tasklists.component.scss"]
})
export class SettingsPageTasklistsComponent implements OnInit {
  tasklists: TaskList[];
  newTaskListName: string;

  constructor(
    private tasklistService: TaskListService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.tasklistService.entries
      .subscribe(tasklists => this.tasklists = tasklists.filter(x => !x.primary));
  }

  delete(tasklist: TaskList) {
    this.tasklistService.delete(tasklist);
  }

  create() {
    const name = (this.newTaskListName || "").trim();
    this.newTaskListName = "";
    if (name.length === 0) {
      return;
    }

    this.tasklistService.add(<TaskList>{ name: name });
  }


}
