import { Injectable } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras, Params } from "@angular/router";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { TaskListService } from "./task-list.service";

/**
 * This class contains information about the state of the tasklist.
 * Whenever we leave something to `undefined` we mean it won't be changed.
 * Setting values to `null` means set to setting to `undefined` (AKA: remove it).
 */
export class TaskPageNavigation {
  /**
   * The tasklist where we need to navigate to.
   * Set to null to go to primary tasklist.
   */
  taskListUuid?: string;

  /**
   * The task we need to show.
   */
  taskUuid?: string;

  /**
   * Show completed tasks.
   */
  showCompleted?: boolean;
}

@Injectable()
export class NavigationService {
  private _primaryTaskListUuid: string = undefined;
  private _taskListUuidValue: string = undefined;
  private _taskUuidValue: string = undefined;
  private _showCompletedValue = false;
  private _taskListUuid = new BehaviorSubject<string>(this._taskListUuidValue);
  private _taskUuid = new BehaviorSubject<string>(this._taskUuidValue);
  private _showCompleted = new BehaviorSubject<boolean>(this._showCompletedValue);

  public get taskListUuid(): Observable<string> { return this._taskListUuid; }
  public get taskUuid(): Observable<string> { return this._taskUuid; }
  public get showCompleted(): Observable<boolean> { return this._showCompleted; }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private taskListService: TaskListService,
  ) {
    this.setup();
  }

  toRoot() {
    this.router.navigate(["/"]);
  }

  toTaskPage(params: TaskPageNavigation) {
    let tasklist = this._taskListUuidValue;
    if (params.taskListUuid !== undefined) {
      tasklist = params.taskListUuid; // Might be null.
      if (tasklist === this._primaryTaskListUuid) {
        tasklist = null; // Primary context does not need to be named.
      }
    }

    let taskUuid = this._taskUuidValue;
    if (params.taskUuid !== undefined) {
      taskUuid = params.taskUuid;
    }

    const showParams: string[] = [];
    if (params.showCompleted !== undefined) {
      this._showCompletedValue = params.showCompleted;
    }

    if (this._showCompletedValue) {
      showParams.push("completed");
    }

    let show = showParams.join(",");
    if (show === "") {
      show = null;
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {
        "taskList": tasklist,
        "task": taskUuid,
        "show": show
      }
    };

    this.router.navigate(["/tasks"], navigationExtras);
  }

  private setup() {
    this.setupPrimaryTasklist();
    this.processRoute();
  }

  private setupPrimaryTasklist() {
    this.taskListService.entries.subscribe(x => {
      const primaryTaskList = x.find(y => y.primary);
      if (primaryTaskList) {
        this._primaryTaskListUuid = primaryTaskList.uuid;
      } else {
        this._primaryTaskListUuid = undefined;
      }
    });
  }

  private processRoute() {
    this.activatedRoute.queryParams.subscribe((pm: Params) => {
      this._taskListUuidValue = pm.taskList as string;
      this._taskListUuid.next(this._taskListUuidValue);

      this._taskUuidValue = pm.task as string;
      this._taskUuid.next(this._taskUuidValue);

      const showValue = pm.show as string;
      this._showCompletedValue = false; // Set to default.

      if (showValue) {
        const showParams = showValue.split(",");
        if (showParams.includes("completed")) {
          this._showCompletedValue = true;
        }
      }

      this._showCompleted.next(this._showCompletedValue);
    });
  }
}
