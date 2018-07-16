import { Component, OnInit, Input } from "@angular/core";
import { Task } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";

@Component({
  selector: "app-task-page-content-pane-title",
  templateUrl: "./task-page-content-pane-title.component.html",
  styleUrls: ["./task-page-content-pane-title.component.scss"],
})
export class TaskPageContentPaneTitleComponent implements OnInit {
  private _task: Task;

  @Input()
  set task(task: Task) {
    this._task = task;
  }

  public get taskTitle(): string {
    return this._task && this._task.title;
  }

  public set taskTitle(v: string) {
    if (this._task) {
      if (this._task.title === v) {
        return;
      }

      this._task.title = v;
      this.taskService.update(this._task);
    }
  }

  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit() {
  }

  reject(event: KeyboardEvent) {
    event.preventDefault();
  }
}
