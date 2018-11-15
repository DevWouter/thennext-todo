import { Component, OnInit, Input } from "@angular/core";
import { Task } from "../../../../models";
import { TaskService, NavigationService } from "../../../../services";

@Component({
  selector: "task-pane-action",
  templateUrl: "./task-pane-action.component.html",
  styleUrls: ["./task-pane-action.component.scss"]
})
export class TaskPaneActionComponent implements OnInit {
  @Input()
  task: Task;
  constructor(
    private readonly taskService: TaskService,
    private readonly navigation: NavigationService,
  ) { }

  ngOnInit(): void { }
  delete() {
    if (confirm(`Are you sure you want to delete "${this.task.title}"?`)) {
      this.taskService.delete(this.task);
      this.navigation.toTaskPage({ taskUuid: null });
    }
  }

  hide() {
    this.navigation.toTaskPage({ taskUuid: null });
  }
}
