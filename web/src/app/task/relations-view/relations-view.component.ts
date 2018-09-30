import { Component, OnInit, Input } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { filter, map, first, tap } from "rxjs/operators";

import {
  Task,
  TaskStatus,
  TaskRelation
} from "../../models";

import {
  ContextService,
  TaskRelationService,
  NavigationService,
  TaskService
} from "../../services";


class RemoteTask {
  relationUuid: string;
  taskUuid: string;
  taskTitle: string;
  isDone: boolean;

  constructor(task: Task, public relation: TaskRelation) {
    this.relationUuid = relation.uuid;
    this.taskUuid = task.uuid;
    this.taskTitle = task.title;
    this.isDone = task.status === TaskStatus.done;
  }
}

@Component({
  selector: "task-relations-view",
  templateUrl: "./relations-view.component.html",
  styleUrls: ["./relations-view.component.scss"]
})
export class RelationsViewComponent implements OnInit {

  get taskname(): string {
    return this._task.title;
  }
  taskUuid: string;
  showDropArea = false;
  taskDragging: string = undefined;
  showExplain = false;
  showExplainBefore = false;
  showExplainAfter = false;

  beforeAllow = true;
  afterAllow = true;

  tasksBefore: RemoteTask[] = [];
  tasksAfter: RemoteTask[] = [];

  private _task: Task;
  private _taskSubject = new BehaviorSubject<Task>(undefined);
  @Input()
  public set task(v: Task) {
    this._task = v;
    this.taskUuid = v.uuid;
    this._taskSubject.next(v);
  }


  constructor(
    private contextService: ContextService,
    private taskRelationService: TaskRelationService,
    private taskService: TaskService,
    private navigationService: NavigationService,
  ) { }

  ngOnInit() {
    this.contextService.taskDragStatus.subscribe(x => {
      this.showDropArea = x;
    });

    this.contextService.taskDragging.subscribe(x => {
      const beforeExists = this.taskRelationService.exists({ before: x, after: this.taskUuid });
      const afterExists = this.taskRelationService.exists({ after: x, before: this.taskUuid });

      if (beforeExists || afterExists) {
        this.beforeAllow = false;
        this.afterAllow = false;
        return;
      }

      this.beforeAllow = this.taskRelationService.checkAllow({ before: x, after: this.taskUuid });
      this.afterAllow = this.taskRelationService.checkAllow({ after: x, before: this.taskUuid });
    });

    combineLatest(
      this.taskRelationService.entries,
      this.taskService.entries,
      this._taskSubject.pipe(filter(x => !!x))
    ).pipe(map(
      ([relations, tasks, task]) => {
        const blockedTasks = relations
          .filter(x => x.sourceTaskUuid === task.uuid)
          .map(relation => {
            const remoteTaskUuid = relation.targetTaskUuid;
            const remoteTask = tasks.find(t => t.uuid === remoteTaskUuid);
            if (remoteTask) {
              return new RemoteTask(remoteTask, relation);
            }
          }).filter(x => !!x);

        const blockingTasks = relations
          .filter(x => x.targetTaskUuid === task.uuid)
          .map(relation => {
            const remoteTaskUuid = relation.sourceTaskUuid;
            const remoteTask = tasks.find(t => t.uuid === remoteTaskUuid);
            if (remoteTask) {
              return new RemoteTask(remoteTask, relation);
            }
          }).filter(x => !!x);

        return { tasksAfter: blockedTasks, tasksBefore: blockingTasks };
      }))
      .subscribe(x => {
        this.tasksBefore = x.tasksBefore;
        this.tasksAfter = x.tasksAfter;
        this.showExplainBefore = x.tasksBefore.length === 0;
        this.showExplainAfter = x.tasksAfter.length === 0;
        this.showExplain = x.tasksAfter.length === 0 && x.tasksBefore.length === 0;
      });
  }

  dragover(event: DragEvent, relationType: "before" | "after") {
    const remoteUuid = event.dataTransfer.getData("task/uuid");

    if (relationType === "before") {
      if (!this.beforeAllow) {
        return;
      }
    } else if (relationType === "after") {
      if (!this.afterAllow) {
        return;
      }
    }
    event.dataTransfer.dropEffect = "copy";
    event.preventDefault(); // It is allowed.
  }

  delete(task: RemoteTask) {
    this.taskRelationService.delete(task.relation);
  }

  drop(event: DragEvent, relationType: "before" | "after") {
    const remoteUuid = event.dataTransfer.getData("task/uuid");

    if (relationType === "before") {
      if (!this.beforeAllow) {
        return;
      }
    } else if (relationType === "after") {
      if (!this.afterAllow) {
        return;
      }
    }

    event.preventDefault(); // It is allowed

    const source = relationType === "before" ? remoteUuid : this.taskUuid;
    const target = relationType !== "before" ? remoteUuid : this.taskUuid;

    this.taskRelationService.add(<TaskRelation>{
      sourceTaskUuid: source,
      targetTaskUuid: target,
      relationType: "blocks",
    });

    this.taskService.entries.pipe(
      map(x => ({
        sourceTask: x.find(y => y.uuid === source),
        targetTask: x.find(y => y.uuid === target),
      })),
      first(),
    ).subscribe(x => {
      if (!(!!x.sourceTask && !!x.targetTask)) {
        return;
      }

      if (x.targetTask.status === TaskStatus.active && x.sourceTask.status === TaskStatus.todo) {
        x.sourceTask.status = TaskStatus.active;
        this.taskService.update(x.sourceTask);
      }
    })

    // Explicit unset of drag-status.
    // This is because the dragged element might no longer exist and as such the drop-event
    // is not invoked.
    this.contextService.setDragStatus(false, undefined);
  }

  goTo(remoteTask: RemoteTask) {
    this.navigationService.toTaskPage({ taskUuid: remoteTask.taskUuid });
  }
}
