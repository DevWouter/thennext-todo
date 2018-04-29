import { Component, OnInit, Input } from "@angular/core";
import { ContextService } from "../services/context.service";
import { Task, TaskStatus } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";
import { TaskView } from "../services/models/task-view";
import { NavigationService } from "../services/navigation.service";

@Component({
  selector: "app-task-page-content-pane-stats",
  templateUrl: "./task-page-content-pane-stats.component.html",
  styleUrls: ["./task-page-content-pane-stats.component.scss"]
})
export class TaskPageContentPaneStatsComponent implements OnInit {
  private _task: Task;
  public get createdOn(): Date { return this._task && this._task.createdOn; }
  public get updatedOn(): Date { return this._task && this._task.updatedOn; }
  public get completedOn(): Date { return this._task && this._task.completedOn; }
  public get sleepUntil(): Date { return this._task && this._task.sleepUntil; }

  get showDelay(): boolean {
    return this._task && !!this._task.sleepUntil;
  }

  get showCompleted(): boolean {
    return this._task && this._task.status === TaskStatus.done;
  }


  @Input()
  public set task(v: Task) {
    this._task = v;
  }

  constructor(
    private taskService: TaskService,
    private navigation: NavigationService,
  ) { }

  ngOnInit() {
  }

  delete() {
    this.taskService.delete(this._task);
    this.navigation.toTaskPage({ taskUuid: null });
  }

  wakeup() {
    this.taskService.wakeup(this.task);
  }
}
