import { Component, OnInit, Input } from "@angular/core";
import { Task } from "../../models";
import { TaskService } from "../../services";

@Component({
  selector: "task-title-input",
  templateUrl: "./title-input.component.html",
  styleUrls: ["./title-input.component.scss"],
})
export class TitleInputComponent implements OnInit {
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
