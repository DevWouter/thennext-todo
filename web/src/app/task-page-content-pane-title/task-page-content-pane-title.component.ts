import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";
import { Task } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";
import { TaskViewService } from "../services/task-view.service";
import { TaskView } from "../services/models/task-view";

@Component({
  selector: "app-task-page-content-pane-title",
  templateUrl: "./task-page-content-pane-title.component.html",
  styleUrls: ["./task-page-content-pane-title.component.scss"]
})
export class TaskPageContentPaneTitleComponent implements OnInit {
  private taskView: TaskView = undefined;

  private _taskTitle: string;
  public get taskTitle(): string {
    return this._taskTitle;
  }
  public set taskTitle(v: string) {
    this._taskTitle = v;
    this.update();
  }

  constructor(
    private contextService: ContextService,
    private taskViewService: TaskViewService,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.contextService.activeTaskView.subscribe(x => {
      this.taskView = x;
      if (this.taskView) {
        this._taskTitle = this.taskView.task.title;
      } else {
        this._taskTitle = "";
      }
    });
  }

  private update() {
    if (!this.taskView) {
      return;
    }

    this.taskView.task.title = this._taskTitle;
    this.taskService.update(this.taskView.task);
  }

}
