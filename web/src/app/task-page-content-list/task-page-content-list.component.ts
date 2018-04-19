import { Component, OnInit } from "@angular/core";
import { TaskService } from "../services/task.service";
import { Task } from "../services/models/task.dto";
import { ContextService } from "../services/context.service";

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
    this.contextService.activeTaskList.filter(x => !!x).combineLatest(this.taskService.entries, (list, tasks) => {
      this.tasks = tasks.filter(x => x.taskListUuid === list.uuid);
    }).subscribe();
  }

  ngOnInit() {
  }

}
