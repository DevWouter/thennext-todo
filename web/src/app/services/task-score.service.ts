import { Injectable } from "@angular/core";
import { DateTime } from "luxon";

import { TaskView } from "./models/task-view";
import { ContextService } from "./context.service";
import { TaskService } from "./task.service";
import { Task, TaskStatus } from "./models/task.dto";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { ScoreShiftService } from "./score-shift.service";
import { ScoreShift } from "./models/score-shift.dto";
import { TaskRelation } from "./models/task-relation.dto";
import { TaskRelationService } from "./task-relation.service";

@Injectable()
export class TaskScoreService {
  public changed = new BehaviorSubject<void>(null);

  private scoreShifts: ScoreShift[] = [];
  private taskRelations: TaskRelation[] = [];

  constructor(
    private readonly scoreShiftService: ScoreShiftService,
    private readonly taskRelationService: TaskRelationService,
  ) { this.setup(); }

  private setup() {
    // Whenever the values of a dependcy change, we need to emit a changed event.
    // That way listeners now they should perform a recalculation.
    this.scoreShiftService.entries
      .combineLatest(this.taskRelationService.entries, (scoreShifts, taskRelations) => {
        this.scoreShifts = scoreShifts;
        this.taskRelations = taskRelations;
        this.changed.next(null);
      }).subscribe();
  }

  calculate(task: Task, tasks: Task[], now: DateTime): TaskView {
    const tv = new TaskView(task);
    tv.score = 0;
    this.addAgeToScore(tv, now);
    this.addScoreShift(tv);
    this.addBlockedScore(tv, tasks);
    this.addBlockingScore(tv, tasks);
    this.addDelay(tv, now);
    return tv;
  }

  private addDelay(tv: TaskView, now: DateTime): void {
    if (tv.task.sleepUntil) {
      const wakeupTime = DateTime.fromJSDate(tv.task.sleepUntil);
      tv.isDelayed = wakeupTime > now;
    }
  }

  private addAgeToScore(tv: TaskView, now: DateTime): void {
    const createdOn = DateTime.fromJSDate(tv.task.createdOn);
    const age_created = now.diff(createdOn).as("days");

    tv.score += age_created * 2;
  }

  private addBlockedScore(tv: TaskView, tasks: Task[]): void {
    const relations = this.taskRelations
      .filter(x => x.targetTaskUuid === tv.task.uuid)
      .filter(r => {
        const task = tasks.find(t => t.uuid === r.sourceTaskUuid);
        return task && task.status !== TaskStatus.done;
      }).filter(r => {
        const task = tasks.find(t => t.uuid === r.targetTaskUuid);
        return task && task.status !== TaskStatus.done;
      })
      ;
    // Remove any relation in which
    if (relations.length !== 0) {
      tv.isBlocked = true;
      tv.score -= 5;
    }
  }

  private addBlockingScore(tv: TaskView, tasks: Task[]): void {
    const relations = this.taskRelations
      .filter(x => x.sourceTaskUuid === tv.task.uuid)
      .filter(r => {
        const task = tasks.find(t => t.uuid === r.sourceTaskUuid);
        return task && task.status !== TaskStatus.done;
      }).filter(r => {
        const task = tasks.find(t => t.uuid === r.targetTaskUuid);
        return task && task.status !== TaskStatus.done;
      });
    if (relations.length !== 0) {
      tv.isBlocking = true;
      tv.score += 8;
    }
  }

  private addScoreShift(tv: TaskView): void {
    const title = tv.task.title;
    this.scoreShifts.forEach(x => {
      const hasPhrase = title.includes(x.phrase);
      if (hasPhrase) {
        tv.score += x.score;
      }
    });
  }
}
