import { Component, OnInit } from "@angular/core";
import { TaskService } from "../services/task.service";
import { Task } from "../services/models/task.dto";
import { ContextService } from "../services/context.service";
import { TaskView } from "../services/models/task-view";

@Component({
  selector: "app-task-page-content-list",
  templateUrl: "./task-page-content-list.component.html",
  styleUrls: ["./task-page-content-list.component.scss"]
})
export class TaskPageContentListComponent implements OnInit {
  public taskViews: TaskView[] = [];
  constructor(
    private readonly taskService: TaskService,
    private readonly contextService: ContextService,
  ) {
    this.contextService.visibleTasks.subscribe(tasks => this.taskViews = tasks);
  }

  ngOnInit() {
  }

}
