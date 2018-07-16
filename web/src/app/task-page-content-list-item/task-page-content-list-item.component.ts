import { Component, OnInit, Input, HostListener } from "@angular/core";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { DateTime, Interval, Duration } from "luxon";

import { Task, TaskStatus } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";
import { ContextService } from "../services/context.service";
import { NavigationService } from "../services/navigation.service";

import { TaskScoreService } from "../services/task-score.service";
import { RelationViewService } from "../services/relation-view.service";

interface State {
  active: boolean;
  blocked: boolean;
  selected: boolean;
  delayed: boolean;
}

@Component({
  selector: "app-task-page-content-list-item",
  templateUrl: "./task-page-content-list-item.component.html",
  styleUrls: ["./task-page-content-list-item.component.scss"],
})
export class TaskPageContentListItemComponent implements OnInit {
  private _blockedUuids: string[] = [];
  score = 0;

  // State is also used to determine the "class of the container"
  state: State = <State>{
    active: false,
    blocked: false,
    delayed: false,
    selected: false,
  };

  checked = false;
  public get classes() {
    return this.state;
  }

  get title() {
    return this.task.title;
  }

  get showPlayIcon(): boolean {
    return this._task.status === TaskStatus.todo;
  }

  get isDone(): boolean {
    return this._task.status === TaskStatus.done;
  }

  get isBlocked(): boolean {
    return this._blockedUuids.includes(this._task.uuid);
  }

  get showPauseIcon(): boolean {
    return this._task.status === TaskStatus.active;
  }

  private _task: Task;
  @Input()
  set task(v: Task) { this._task = v; this.updateTask(); }
  get task(): Task { return this._task; }

  @HostListener("click") onClick() {
    this.navigation.toTaskPage({ taskUuid: this.task.uuid });
  }

  constructor(
    private navigation: NavigationService,
    private taskService: TaskService,
    private relationViewService: RelationViewService,
    private contextService: ContextService,
    private taskScoreService: TaskScoreService,
  ) { }

  ngOnInit() {
    this.taskScoreService.taskScores.subscribe(taskScores => {
      const taskScore = taskScores.find(x => x.taskUuid === this._task.uuid);
      if (taskScore) {
        this.score = taskScore.score;
      } else {
        this.score = Number.NaN;
      }
    });

    this.relationViewService.blockedTaskUuids.subscribe(x => this._blockedUuids = x);

    combineLatest(
      this.navigation.taskUuid,
      this.taskScoreService.delayedTaskUuids,
      this.relationViewService.blockedTaskUuids,
    ).subscribe(([taskUuid, delayedTaskUuids, blockedTaskUuids]) => {
        this.state = <State>{
          active: (this.task.status === TaskStatus.active),
          blocked: blockedTaskUuids.includes(this.task.uuid),
          delayed: delayedTaskUuids.includes(this.task.uuid),
          selected: this.task.uuid === taskUuid
        };
      });
  }

  check() {
    if (this.isBlocked) {
      if (!confirm("Do you want to mark the task as done?\n\n" +
        "We ask this since another task that should have been completed before this one hasn't been completed.")) {
        return;
      }
    }

    this.task.completedOn = new Date();
    this.task.status = TaskStatus.done;
    this.taskService.update(this.task);
    this.checked = true;
  }

  uncheck() {
    this.task.completedOn = null;
    this.task.status = TaskStatus.todo;
    this.taskService.update(this.task);
    this.checked = false;
  }

  updateTask() {
    if (this.task) {
      this.checked = this.task.status === TaskStatus.done;
    }
  }

  play() {
    console.log("play");
    this.checked = false;
    this.task.status = TaskStatus.active;
    this.taskService.update(this.task);
  }

  pause() {
    console.log("pause");
    this.checked = false;
    this.task.status = TaskStatus.todo;
    this.taskService.update(this.task);
  }

  dragStart(event: DragEvent) {
    event.dataTransfer.setData("task/uuid", this.task.uuid);
    this.contextService.setDragStatus(true, this.task.uuid);
  }

  dragEnd(event: DragEvent) {
    this.contextService.setDragStatus(false, undefined);
  }
}
