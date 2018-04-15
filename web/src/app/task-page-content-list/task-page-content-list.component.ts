import { Component, OnInit } from "@angular/core";
import { TaskService, Task } from "../services/task.service";

@Component({
  selector: "app-task-page-content-list",
  templateUrl: "./task-page-content-list.component.html",
  styleUrls: ["./task-page-content-list.component.scss"]
})
export class TaskPageContentListComponent implements OnInit {
  public tasks: Task[] = [];
  constructor(
    private readonly taskService: TaskService
  ) {
    this.taskService.tasks.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  ngOnInit() {
  }

}
