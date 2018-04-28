import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";
import { Task } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";
import { TaskView } from "../services/models/task-view";
import { NavigationService } from "../services/navigation.service";

@Component({
  selector: "app-task-page-content-pane-stats",
  templateUrl: "./task-page-content-pane-stats.component.html",
  styleUrls: ["./task-page-content-pane-stats.component.scss"]
})
export class TaskPageContentPaneStatsComponent implements OnInit {

  private _taskView: TaskView;
  public createdOn: Date;
  public updatedOn: Date;
  public completedOn: Date;
  public score: number;


  constructor(
    private contextService: ContextService,
    private taskService: TaskService,
    private navigation: NavigationService,
  ) { }

  ngOnInit() {
    this.contextService.activeTaskView.subscribe(x => this.setTask(x));
  }

  private setTask(taskView: TaskView) {
    this._taskView = taskView;
    if (taskView) {
      this.createdOn = taskView.task.createdOn;
      this.updatedOn = taskView.task.updatedOn;
      this.completedOn = taskView.task.completedOn;
      this.score = taskView.score;
    } else {
      this.createdOn = undefined;
      this.updatedOn = undefined;
      this.completedOn = undefined;
      this.score = undefined;
    }
  }

  delete() {
    this.taskService.delete(this._taskView.task);
    this.navigation.toTaskPage({ taskUuid: null });
  }
}
