import { Component, OnInit, Input, HostListener } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { Task, TaskStatus } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";
import { ContextService } from "../services/context.service";
import { NavigationService } from "../services/navigation.service";

import { DateTime, Interval, Duration } from "luxon";
import { TaskScoreService } from "../services/task-score.service";

enum State {
  default = "default",
  active = "active",
  delayed = "delayed",
  selected = "selected",
  new = "new",
  selectedActive = "selectedActive",
  selectedDelayed = "selectedDelayed"
}

@Component({
  selector: "app-task-page-content-list-item",
  templateUrl: "./task-page-content-list-item.component.html",
  styleUrls: ["./task-page-content-list-item.component.scss"],
  animations: [
    trigger("taskState", [
      state(State.default, style({
        // backgroundColor: 'white',
      })),
      state(State.new, style({
        backgroundColor: "yellow",
      })),
      state(State.active, style({
        fontWeight: "bold",
      })),
      state(State.selected, style({
        backgroundColor: "#e1f2fe",
      })),
      state(State.delayed, style({
        fontStyle: "italic",
        color: "grey",
      })),
      state(State.selectedActive, style({
        fontWeight: "bold",
        backgroundColor: "#e1f2fe",
      })),
      state(State.selectedDelayed, style({
        color: "grey",
        fontStyle: "italic",
        backgroundColor: "#e1f2fe",
      })),
      transition(`${State.new} => ${State.default}`, animate("1000ms ease-in")),
    ])
  ]
})
export class TaskPageContentListItemComponent implements OnInit {
  private _delayedUuids: string[] = [];
  state = State.default;
  score = 0;
  checked = false;
  get title() {
    return this.task.title;
  }

  get showCommentIcon(): boolean {
    return this._task.description.trim().length !== 0;
  }

  get showSleepIcon(): boolean {
    return !this._delayedUuids.includes(this._task.uuid);
  }
  get showPlayIcon(): boolean {
    return this._task.status === TaskStatus.todo;
  }
  get isDone(): boolean {
    return this._task.status === TaskStatus.done;
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

    this.navigation.taskUuid
      .combineLatest(this.taskScoreService.delayedTaskUuids, (taskUuid, delayedTaskUuids) => ({
        taskUuid,
        delayedTaskUuids,
      }))
      .subscribe(combo => {
        const taskUuid = combo.taskUuid;
        const isDelayed = combo.delayedTaskUuids.includes(this.task.uuid);
        if (this.task.uuid === taskUuid) {
          if (this.task.status === TaskStatus.active) {
            this.state = State.selectedActive;
          } else if (isDelayed) {
            this.state = State.selectedDelayed;
          } else {
            this.state = State.selected;
          }
        } else {
          if (this.task.status === TaskStatus.active) {
            this.state = State.active;
          } else if (isDelayed) {
            this.state = State.delayed;
          } else {
            this.state = State.default;
          }
        }
      });
  }

  check() {
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
