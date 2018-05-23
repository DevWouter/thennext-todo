import { Injectable } from "@angular/core";
import { DateTime } from "luxon";

import { ContextService } from "./context.service";
import { TaskService } from "./task.service";
import { Task, TaskStatus } from "./models/task.dto";
import { BehaviorSubject, Observable } from "rxjs";
import { interval } from "rxjs";
import { ScoreShiftService } from "./score-shift.service";
import { ScoreShift } from "./models/score-shift.dto";
import { TaskRelation } from "./models/task-relation.dto";
import { TaskRelationService } from "./task-relation.service";
import { RelationViewService } from "./relation-view.service";
import { map, combineLatest, distinctUntilChanged, filter } from "rxjs/operators";

export interface Modifier {
  description: string;
  score: number;
}

export class TaskScoreView {
  taskUuid: string;     // The uuid of the task.
  score: number;        // The exact score of the task (used for sorting).
  roundedScore: number; // The rounded score of the task (which is used for invalidating the list)
  modifiers: Modifier[] = [];
}

@Injectable()
export class TaskScoreService {

  // When set, this will cause the score to be calculated
  private _timeSubject = new BehaviorSubject<Date>(new Date());

  private _taskScores = new BehaviorSubject<TaskScoreView[]>(undefined);
  private _delayedTaskUuids = new BehaviorSubject<string[]>(undefined);

  public get taskScores(): Observable<TaskScoreView[]> { return this._taskScores.pipe(filter(x => !!x)); }
  public get delayedTaskUuids(): Observable<string[]> { return this._delayedTaskUuids.pipe(filter(x => !!x)); }

  constructor(
    private readonly taskService: TaskService,                   // Since we need the title
    private readonly scoreShiftService: ScoreShiftService,
    private readonly taskRelationService: TaskRelationService,
    private readonly relationViewService: RelationViewService,
  ) { this.setup(); }

  private setup() {
    // Whenever the values of a dependcy change, we need to emit a changed event.
    // That way listeners now they should perform a recalculation.
    this._timeSubject.pipe(
      map(x => DateTime.fromJSDate(x))
      , combineLatest(
        this.taskService.entries,
        this.scoreShiftService.entries,
        this.relationViewService.blockedTaskUuids,
        this.relationViewService.blockingTaskUuids,
        (
          now,
          tasks,
          scoreShifts,
          blockedTaskUuids,
          blockingTaskUuids
        ) => {
          return tasks.map(task => {
            const r = new TaskScoreView();
            r.taskUuid = task.uuid;
            if (task.status !== TaskStatus.done) {
              r.modifiers.push(...this.getBlockScore(task, blockedTaskUuids, blockingTaskUuids));
              r.modifiers.push(...this.getTermScore(task, scoreShifts));
              r.modifiers.push(...this.getActiveScore(task));
              r.modifiers.push(...this.getDescriptionScore(task));
              r.modifiers.push(...this.getAgeScore(task, now));
            } else {
              r.modifiers.push(...this.getCompletionScore(task, now));
            }

            r.score = r.modifiers.reduce((pv, cv) => pv + cv.score, 0);
            r.roundedScore = Math.round(r.score * 10) / 10;

            return r;
          });
        })
      , map(x => x.sort((a, b) => b.score - a.score))
      , distinctUntilChanged((x, y) =>
        x.length === y.length &&
        x.every((v, i) =>
          v.taskUuid === y[i].taskUuid &&            // Check if the order is the same
          v.roundedScore === y[i].roundedScore)      // Check if the visual score has changed.
      ))
      .subscribe(scores => this._taskScores.next(scores));

    this._timeSubject
      .pipe(
        map(x => DateTime.fromJSDate(x)),
        combineLatest(this.taskService.entries, (now, tasks) => {
          return tasks
            .filter(x => x.sleepUntil && DateTime.fromJSDate(x.sleepUntil) > now)
            .map(x => x.uuid);
        }),
        distinctUntilChanged((x, y) => x.length === y.length && x.every((v, i) => v === y[i]))
      ).subscribe(x => {
        this._delayedTaskUuids.next(x);
      });
  }

  private getBlockScore(task: Task, blockedTaskUuids: string[], blockingTaskUuids: string[]): Modifier[] {
    if (blockedTaskUuids.includes(task.uuid)) {
      return [{ description: "Blocked by another task", score: -2.5 }];
    }

    if (blockingTaskUuids.includes(task.uuid)) {
      return [{ description: "Required by another task", score: 4 }];
    }

    return [];
  }

  private getTermScore(task: Task, scoreShifts: ScoreShift[]): Modifier[] {
    const r: Modifier[] = [];
    scoreShifts.forEach((cv) => {
      const hasPhrase = task.title.includes(cv.phrase);
      if (hasPhrase) {
        r.push({ description: `Has the phrase ${cv.phrase}`, score: cv.score });
      }
    });

    return r;
  }

  private getAgeScore(task: Task, now: DateTime): Modifier[] {
    const createdOn = DateTime.fromJSDate(task.createdOn);
    const age_created = now.diff(createdOn).as("days");
    return [{ description: "Days since creation", score: age_created }];
  }

  private getCompletionScore(task: Task, now: DateTime): Modifier[] {
    const completedOn = DateTime.fromJSDate(task.completedOn);
    const age_completed = now.diff(completedOn).as("days");
    return [{ description: "Days since completion", score: age_completed }];
  }

  private getActiveScore(task: Task): Modifier[] {
    if (task.status === TaskStatus.active) {
      return [{ description: "Is active", score: 2 }];
    }
    return [];
  }

  private getDescriptionScore(task: Task): Modifier[] {
    if ((task.description || "").trim().length > 0) {
      return [{ description: "Contains description", score: 0.5 }];
    }

    return [];
  }

  /**
   * Call this function to update scorelist.
   * @param date The date used to determine the score
   */
  public update(date: Date): void {
    this._timeSubject.next(date);
  }
}
