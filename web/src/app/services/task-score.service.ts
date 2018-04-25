import { Injectable } from "@angular/core";
import { DateTime } from "luxon";

import { TaskView } from "./models/task-view";
import { ContextService } from "./context.service";
import { TaskService } from "./task.service";
import { Task } from "./models/task.dto";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { ScoreShiftService } from "./score-shift.service";
import { ScoreShift } from "./models/score-shift.dto";

@Injectable()
export class TaskScoreService {
  public changed = new BehaviorSubject<void>(null);

  private scoreShifts: ScoreShift[] = [];

  constructor(
    private readonly scoreShiftService: ScoreShiftService,
  ) { this.setup(); }

  private setup() {
    // Whenever the values of a dependcy change, we need to emit a changed event.
    // That way listeners now they should perform a recalculation.
    this.scoreShiftService.entries.subscribe(x => {
      this.scoreShifts = x;
      this.changed.next(null);
    });
  }

  calculate(task: Task, tasks: Task[], now: DateTime): TaskView {
    const tv = new TaskView(task);
    tv.score = 0;
    this.addAgeToScore(tv, now);
    this.addScoreShift(tv);
    return tv;
  }

  private addAgeToScore(tv: TaskView, now: DateTime): void {
    const createdOn = DateTime.fromJSDate(tv.task.createdOn);
    const age_created = now.diff(createdOn).as("days");

    tv.score += age_created * 2;
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
