import { Injectable } from "@angular/core";
import { TaskService } from "./task.service";
import { TaskRelationService } from "./task-relation.service";
import { TaskStatus } from "./models/task.dto";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { TaskRelation } from "./models/task-relation.dto";
import { Observable } from "rxjs/Observable";

@Injectable()
export class RelationViewService {
  private _blockingRelations = new BehaviorSubject<TaskRelation[]>([]);
  private _blockedTaskUuids = new BehaviorSubject<string[]>([]);
  private _blockingTaskUuids = new BehaviorSubject<string[]>([]);

  public get blockedTaskUuids(): Observable<string[]> { return this._blockedTaskUuids; }
  public get blockingTaskUuids(): Observable<string[]> { return this._blockingTaskUuids; }

  constructor(
    private readonly taskService: TaskService,
    private readonly taskRelationService: TaskRelationService,
  ) {
    this.setup();
  }

  private setup() {
    this.setupActiveRelations();
    this.setupListOfBlockedTasks();
    this.setupListOfBlockingTasks();
  }

  private setupActiveRelations() {
    this.taskService.entries
      .combineLatest(this.taskRelationService.entries, (tasks, relations) => {
        return relations.filter(r => {
          return tasks
            .filter(t => t.uuid === r.sourceTaskUuid) // Find the source task
            .some(t => t.status !== TaskStatus.done); // and see if the source task is done or not
        });
      })
      .distinctUntilChanged((x, y) =>
        x.length === y.length &&                      // If length differs then we have change
        x.every((v, i) => v.uuid === y[i].uuid)       // If length does differ check if the relations are the same
      )
      .subscribe(relations => {
        this._blockingRelations.next(relations);      // Update the list of relations that causes blocking.
      });
  }

  private setupListOfBlockedTasks() {
    this._blockingRelations
      .map(x => x.map(y => y.targetTaskUuid))              // Get the targets (aka children)
      .map(x => x.filter((v, i, a) => a.indexOf(v) === i)) // Unique values.
      .distinctUntilChanged((x, y) =>                      // Check if the list has changed (child can have multiple blockers)
        x.length === y.length &&                           //   - Both arrays should at least be of same length
        x.every((v, i) => v === y[i])                      //   - Each value should be at the same location.
      )
      .subscribe((blockedTaskUuids) => {
        this._blockedTaskUuids.next(blockedTaskUuids);     // Store them.
      });
  }

  private setupListOfBlockingTasks() {
    this._blockingRelations
      .map(x => x.map(y => y.sourceTaskUuid))              // Get the source (aka parents)
      .map(x => x.filter((v, i, a) => a.indexOf(v) === i)) // Unique values.
      .distinctUntilChanged((x, y) =>                      // Check if the list has changed (parent can have multiple children)
        x.length === y.length &&                           //   - Both arrays should at least be of same length
        x.every((v, i) => v === y[i])                      //   - Each value should be at the same location.
      )
      .subscribe((blockingTasks) => {
        this._blockingTaskUuids.next(blockingTasks);       // Store them.
      });
  }
}
