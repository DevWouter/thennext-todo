import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";
import { Task } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";

@Component({
  selector: "app-task-page-content-pane-title",
  templateUrl: "./task-page-content-pane-title.component.html",
  styleUrls: ["./task-page-content-pane-title.component.scss"]
})
export class TaskPageContentPaneTitleComponent implements OnInit {
  private task: Task = undefined;

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
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.contextService.activeTask.subscribe(x => {
      this.task = x;
      if (this.task) {
        this._taskTitle = this.task.title;
      } else {
        this._taskTitle = "";
      }
    });
  }

  private update() {
    if (!this.task) {
      return;
    }

    this.task.title = this._taskTitle;
    this.taskService.update(this.task);
  }

}
