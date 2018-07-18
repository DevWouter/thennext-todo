import { Component, OnInit, Input } from "@angular/core";
import { TaskService } from "../../services";
import { Task } from "../../models";

@Component({
  selector: "task-description-input",
  templateUrl: "./description-input.component.html",
  styleUrls: ["./description-input.component.scss"]
})
export class DescriptionInputComponent implements OnInit {
  private _task: Task;

  public get value(): string { return this._task && this._task.description; }
  public set value(v: string) {
    if (this._task) {
      if (this._task.description === v) {
        return; // No change
      }

      this._task.description = v;
      this.taskService.update(this._task);
    }
  }

  @Input()
  public set task(task: Task) {
    this._task = task;
  }

  constructor(
    private taskService: TaskService,
  ) {
  }

  ngOnInit() {
  }
}
