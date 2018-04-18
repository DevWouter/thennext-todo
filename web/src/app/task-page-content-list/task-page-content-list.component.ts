import { Component, OnInit } from "@angular/core";
import { TaskService } from "../services/task.service";
import { Task } from "../services/models/task.dto";

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
    this.taskService.entries.subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  ngOnInit() {
  }

}
