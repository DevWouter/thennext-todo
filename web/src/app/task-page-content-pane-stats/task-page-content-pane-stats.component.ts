import { Component, OnInit, Input } from "@angular/core";
import { ContextService } from "../services/context.service";
import { Task, TaskStatus } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";
import { NavigationService } from "../services/navigation.service";
import { TaskScoreService, Modifier as TaskScoreModifier } from "../services/task-score.service";
import { BehaviorSubject, Subscription } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-task-page-content-pane-stats",
  templateUrl: "./task-page-content-pane-stats.component.html",
  styleUrls: ["./task-page-content-pane-stats.component.scss"]
})
export class TaskPageContentPaneStatsComponent implements OnInit {
  private _task: Task;
  private _delayedUuids: string[] = [];
  public get completedOn(): Date { return this._task && this._task.completedOn; }
  public get sleepUntil(): Date { return this._task && this._task.sleepUntil; }
  public urgency = 0;
  public showUrgencyBreakdown = false;
  public modifiers: TaskScoreModifier[] = [];
  private _scoreSubscription = Subscription.EMPTY;

  get showDelay(): boolean {
    return this._delayedUuids.includes(this._task.uuid);
  }

  get showCompleted(): boolean {
    return this._task && this._task.status === TaskStatus.done;
  }

  @Input()
  public set task(v: Task) {
    this._scoreSubscription.unsubscribe();
    this._task = v;

    if (this._task) {
      this._scoreSubscription = this.scoreService.taskScores
        .pipe(map(x => x.find(y => y.taskUuid === v.uuid)))
        .subscribe(x => {
          if (x) {
            this.modifiers = x.modifiers;
            this.urgency = Math.round(x.score * 10) / 10;
          } else {
            this.modifiers = [];
            this.urgency = 0;
          }
        });
    } else {
      this.modifiers = [];
      this.urgency = 0;
      this._scoreSubscription = Subscription.EMPTY;
    }
  }

  constructor(
    private taskService: TaskService,
    private navigation: NavigationService,
    private scoreService: TaskScoreService,
  ) { }

  ngOnInit() {
    this.scoreService.delayedTaskUuids.subscribe(x => this._delayedUuids = x);
  }

  wakeup() {
    this.taskService.wakeup(this._task);
  }
  toggleUrgencyBreakdown() {
    this.showUrgencyBreakdown = !this.showUrgencyBreakdown;
  }
}
