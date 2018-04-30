import { Injectable } from "@angular/core";
import { DateTime } from "luxon";

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
import { RelationViewService } from "./relation-view.service";

export class TaskScoreView {
  taskUuid: string;     // The uuid of the task.
  score: number;        // The exact score of the task (used for sorting).
  roundedScore: number; // The rounded score of the task (which is used for invalidating the list)
}

@Injectable()
export class TaskScoreService {
  // When set, this will cause the score to be calculated
  private _timeSubject = new BehaviorSubject<Date>(new Date());

  private _scoreShifts: ScoreShift[] = [];
  private _blockedTaskUuids: string[] = [];
  private _blockingTaskUuids: string[] = [];

  private _taskScores = new BehaviorSubject<TaskScoreView[]>(undefined);

  public get taskScores(): Observable<TaskScoreView[]> { return this._taskScores.filter(x => !!x); }

  constructor(
    private readonly taskService: TaskService,                   // Since we need the title
    private readonly scoreShiftService: ScoreShiftService,
    private readonly taskRelationService: TaskRelationService,
    private readonly relationViewService: RelationViewService,
  ) { this.setup(); }

  private setup() {
    // Whenever the values of a dependcy change, we need to emit a changed event.
    // That way listeners now they should perform a recalculation.
    this._timeSubject
      .map(x => DateTime.fromJSDate(x))
      .combineLatest(
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
            r.score = 0;
            r.score += this.getBlockScore(task, blockedTaskUuids, blockingTaskUuids);
            r.score += this.getTermScore(task, scoreShifts);
            r.score += this.getAgeScore(task, now);
            r.score += this.getActiveScore(task);

            r.roundedScore = Math.floor(r.score * 10) / 10;
            return r;
          });
        })
      .map(x => x.sort((a, b) => b.score - a.score))
      .distinctUntilChanged((x, y) =>
        x.length === y.length &&
        x.every((v, i) =>
          v.taskUuid === y[i].taskUuid &&            // Check if the order is the same
          v.roundedScore === y[i].roundedScore)      // Check if the visual score has changed.
      )
      .subscribe(scores => this._taskScores.next(scores));
  }

  private getBlockScore(task: Task, blockedTaskUuids: string[], blockingTaskUuids: string[]): number {
    if (blockedTaskUuids.includes(task.uuid)) {
      return -5;
    }

    if (blockingTaskUuids.includes(task.uuid)) {
      return 8;
    }

    return 0;
  }

  private getTermScore(task: Task, scoreShifts: ScoreShift[]): number {
    return scoreShifts.reduce((pv, cv) => {
      const hasPhrase = task.title.includes(cv.phrase);
      if (hasPhrase) {
        return pv + cv.score;
      }

      return pv;
    }, 0);
  }

  private getAgeScore(task: Task, now: DateTime): number {
    const createdOn = DateTime.fromJSDate(task.createdOn);
    const age_created = now.diff(createdOn).as("days");
    return age_created * 2;
  }

  private getActiveScore(task: Task): number {
    return task.status === TaskStatus.active ? 4 : 0;
  }

  /**
   * Call this function to update scorelist.
   * @param date The date used to determine the score
   */
  public update(date: Date): void {
    this._timeSubject.next(date);
  }
}
