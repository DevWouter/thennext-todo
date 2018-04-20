import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";
import { TaskService } from "../services/task.service";
import { Task } from "../services/models/task.dto";
import { TaskView } from "../services/models/task-view";

@Component({
  selector: "app-task-page-content-pane-description",
  templateUrl: "./task-page-content-pane-description.component.html",
  styleUrls: ["./task-page-content-pane-description.component.scss"]
})
export class TaskPageContentPaneDescriptionComponent implements OnInit {
  private taskView: TaskView;
  private _value: string;
  public get value(): string { return this._value; }
  public set value(v: string) { this._value = v; this.update(); }

  constructor(
    private contextService: ContextService,
    private taskService: TaskService,
  ) {
  }

  ngOnInit() {
    this.setup();
  }


  private setup() {
    this.contextService.activeTaskView.subscribe((x) => {
      this.taskView = x;
      if (this.taskView) {
        this._value = this.taskView.task.description;
      }
    });
  }

  private update() {
    if (this.taskView) {
      this.taskView.task.description = this.value;
      this.taskService.update(this.taskView.task);
    }
  }

}
