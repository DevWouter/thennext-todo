import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import {
  TaskScoreService,
  TaskScoreModifier,
} from "../../services";
import {
  Task,
  TaskStatus,
} from "../../models";

@Component({
  selector: "task-stats-view",
  templateUrl: "./stats-view.component.html",
  styleUrls: ["./stats-view.component.scss"]
})
export class StatsViewComponent implements OnInit, OnDestroy {
  private _task: Task;
  private _delayedUuids: string[] = [];
  public get completedOn(): Date { return this._task && this._task.completedOn; }
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
    private scoreService: TaskScoreService,
  ) { }

  ngOnInit() {
    this.scoreService.delayedTaskUuids.subscribe(x => this._delayedUuids = x);
  }

  ngOnDestroy() {
    this._scoreSubscription.unsubscribe();
    this._scoreSubscription = Subscription.EMPTY;
  }

  toggleUrgencyBreakdown() {
    this.showUrgencyBreakdown = !this.showUrgencyBreakdown;
  }
}
