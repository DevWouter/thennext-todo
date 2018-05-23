import { Injectable } from "@angular/core";

import { ContextService } from "./context.service";
import { TaskService } from "./task.service";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { interval } from "rxjs";
import { DateTime } from "luxon";
import { TaskScoreService } from "./task-score.service";
import { TaskRelationService } from "./task-relation.service";
import { TaskRelation } from "./models/task-relation.dto";

@Injectable()
export class TaskViewService {


  private _timer = interval(1000);

  constructor(
    private readonly taskService: TaskService,
    private readonly taskScoreService: TaskScoreService,
    // TODO: Inject settings service which contains calculation method
  ) { this.setup(); }

  private setup() {
    this.newSetup();
  }

  private newSetup() {
    // Whenever the time ticks we ask the task.
    this._timer.subscribe(() => {
      this.taskScoreService.update(new Date());
    });
  }
}
