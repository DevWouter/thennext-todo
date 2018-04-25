import { Injectable } from "@angular/core";

import { TaskView } from "./models/task-view";
import { ContextService } from "./context.service";
import { TaskService } from "./task.service";
import { Task } from "./models/task.dto";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { DateTime } from "luxon";
import { TaskScoreService } from "./task-score.service";

@Injectable()
export class TaskViewService {
  private _entries = new BehaviorSubject<TaskView[]>(undefined);
  private _timer = new IntervalObservable(1000);
  public get entries(): Observable<TaskView[]> { return this._entries.filter(x => !!x); }

  constructor(
    private readonly taskService: TaskService,
    private readonly taskScoreService: TaskScoreService,
    // TODO: Inject settings service which contains calculation method
  ) { this.setup(); }

  setup() {

    const tasksObservable = this.taskService.entries;
    tasksObservable
      .combineLatest(this._timer, (tasks, time) => tasks)
      .map(tasks => {
        const now = DateTime.local();
        return tasks.map(task => this.calc(task, tasks, now));
      })
      .subscribe(x => this._entries.next(x));
  }

  calc(task: Task, tasks: Task[], now: DateTime): TaskView {
    return this.taskScoreService.calculate(task, tasks, now);
  }
}
