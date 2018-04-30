import { Component, OnInit } from "@angular/core";

import { TaskService } from "../services/task.service";
import { ContextService } from "../services/context.service";

import { Task } from "../services/models/task.dto";

@Component({
  selector: "app-task-page-content-list",
  templateUrl: "./task-page-content-list.component.html",
  styleUrls: ["./task-page-content-list.component.scss"]
})
export class TaskPageContentListComponent implements OnInit {
  public tasks: Task[] = [];
  constructor(
    private readonly taskService: TaskService,
    private readonly contextService: ContextService,
  ) {
  }

  ngOnInit() {
    this.contextService.visibleTasks
      .subscribe(tasks => this.tasks = tasks);
  }

}
