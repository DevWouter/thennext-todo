import { Component, OnInit, Input, HostListener } from "@angular/core";
import { Task, TaskStatus } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";
import { ContextService } from "../services/context.service";
import { NavigationService } from "../services/navigation.service";

import { DateTime, Interval, Duration } from "luxon";
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
  private _delayedUuids: string[] = [];
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

  get showSleepIcon(): boolean {
    return !this._delayedUuids.includes(this._task.uuid) && this._task.status !== TaskStatus.active;
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

    this.taskScoreService.delayedTaskUuids.subscribe(x => this._delayedUuids = x);
    this.relationViewService.blockedTaskUuids.subscribe(x => this._blockedUuids = x);

    this.navigation.taskUuid
      .combineLatest(
        this.taskScoreService.delayedTaskUuids,
        this.relationViewService.blockedTaskUuids,
        (taskUuid, delayedTaskUuids, blockedTaskUuids) => ({
          taskUuid,
          delayedTaskUuids,
          blockedTaskUuids,
        }))
      .subscribe(combo => {
        const taskUuid = combo.taskUuid;
        this.state = <State>{
          active: (this.task.status === TaskStatus.active),
          blocked: combo.blockedTaskUuids.includes(this.task.uuid),
          delayed: combo.delayedTaskUuids.includes(this.task.uuid),
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

  delay() {
    let local = DateTime.local().set({
      hour: 7,
      minute: 0,
      second: 0,
      millisecond: 0
    });

    if (local < DateTime.local()) {
      local = local.plus({ days: 1 });
    }

    this.taskService.delay(this.task, local.toJSDate());
  }

  dragStart(event: DragEvent) {
    event.dataTransfer.setData("task/uuid", this.task.uuid);
    this.contextService.setDragStatus(true, this.task.uuid);
  }

  dragEnd(event: DragEvent) {
    this.contextService.setDragStatus(false, undefined);
  }
}
