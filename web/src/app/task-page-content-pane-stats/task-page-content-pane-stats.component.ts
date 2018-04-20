import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";
import { Task } from "../services/models/task.dto";

@Component({
  selector: "app-task-page-content-pane-stats",
  templateUrl: "./task-page-content-pane-stats.component.html",
  styleUrls: ["./task-page-content-pane-stats.component.scss"]
})
export class TaskPageContentPaneStatsComponent implements OnInit {

  public createdOn: Date;
  public updatedOn: Date;
  public completedOn: Date;

  private _task: Task = null;
  public get task(): Task {
    return this._task;
  }
  public set task(v: Task) {
    this._task = v;
    if (this._task) {
      this.createdOn = this._task.createdOn;
      this.updatedOn = this._task.updatedOn;
      this.completedOn = this._task.completedOn;
    } else {
      this.createdOn = undefined;
      this.updatedOn = undefined;
      this.completedOn = undefined;
    }
  }

  constructor(
    private contextService: ContextService,
  ) { }

  ngOnInit() {
    this.contextService.activeTask.subscribe(x => this.task = x);
  }

}
