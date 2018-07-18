import { Injectable } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras, Params } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

import { TaskListService } from "./task-list.service";
import { StorageService, StorageKey } from "./storage.service";

import { TaskPageNavigation } from "../models";

enum ShowValues {
  completed = "completed",
  delayed = "delayed",
}
enum OnlyValues {
  unblocked = "unblocked",
  positive = "positive",
}

@Injectable()
export class NavigationService {
  private _primaryTaskListUuid: string = undefined;
  private _taskListUuidValue: string = undefined;
  private _taskUuidValue: string = undefined;
  private _searchValue: string = undefined;
  private _showCompletedValue = false;
  private _showDelayedValue = false;
  private _onlyUnblockedValue = false;
  private _onlyPositiveValue = false;
  private _taskListUuid = new BehaviorSubject<string>(this._taskListUuidValue);
  private _taskUuid = new BehaviorSubject<string>(this._taskUuidValue);
  private _showCompleted = new BehaviorSubject<boolean>(this._showCompletedValue);
  private _showDelayed = new BehaviorSubject<boolean>(this._showDelayedValue);
  private _onlyUnblocked = new BehaviorSubject<boolean>(this._onlyUnblockedValue);
  private _onlyPositive = new BehaviorSubject<boolean>(this._onlyPositiveValue);
  private _search = new BehaviorSubject<string>(this._searchValue);

  public get taskListUuid(): Observable<string> { return this._taskListUuid; }
  public get taskUuid(): Observable<string> { return this._taskUuid; }
  public get showCompleted(): Observable<boolean> { return this._showCompleted; }
  public get showDelayed(): Observable<boolean> { return this._showDelayed; }
  public get onlyUnblocked(): Observable<boolean> { return this._onlyUnblocked; }
  public get onlyPositive(): Observable<boolean> { return this._onlyPositive; }
  public get search(): Observable<string> { return this._search; }

  public get lastTaskListUuid(): string {
    return this.storageService.get(StorageKey.LAST_TASKLIST);
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private taskListService: TaskListService,
    private storageService: StorageService,
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
      this.storageService.set(StorageKey.LAST_TASKLIST, tasklist);
      if (tasklist === this._primaryTaskListUuid) {
        tasklist = null; // Primary context does not need to be named.
      }
    }

    let taskUuid = this._taskUuidValue;
    if (params.taskUuid !== undefined) {
      taskUuid = params.taskUuid;
    }

    const showParams: ShowValues[] = [];
    const onlyParams: OnlyValues[] = [];
    if (params.showCompleted !== undefined) {
      this._showCompletedValue = params.showCompleted;
    }

    if (params.showDelayed !== undefined) {
      this._showDelayedValue = params.showDelayed;
    }

    if (params.onlyPositive !== undefined) {
      this._onlyPositiveValue = params.onlyPositive;
    }

    if (params.onlyUnblocked !== undefined) {
      this._onlyUnblockedValue = params.onlyUnblocked;
    }

    if (this._showCompletedValue) {
      showParams.push(ShowValues.completed);
    }

    if (this._showDelayedValue) {
      showParams.push(ShowValues.delayed);
    }

    if (this._onlyPositiveValue) {
      onlyParams.push(OnlyValues.positive);
    }

    if (this._onlyUnblockedValue) {
      onlyParams.push(OnlyValues.unblocked);
    }

    let show = showParams.join(",");
    if (show === "") {
      show = null;
    }

    let only = onlyParams.join(",");
    if (only === "") {
      only = null;
    }

    let search = this._searchValue;
    if (params.search !== undefined) {
      search = params.search;
    }

    if (search === "") {
      search = undefined;
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {
        "taskList": tasklist,
        "task": taskUuid,
        "show": show,
        "only": only,
        "search": search,
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

      this._searchValue = pm.search as string;
      this._search.next(this._searchValue);

      this._showCompletedValue = false; // Set to default.
      this._showDelayedValue = false;

      const showValue = pm.show as string;
      if (showValue) {
        const showParams = showValue.split(",");
        if (showParams.includes(ShowValues.completed)) {
          this._showCompletedValue = true;
        }
        if (showParams.includes(ShowValues.delayed)) {
          this._showDelayedValue = true;
        }
      }

      this._showCompleted.next(this._showCompletedValue);
      this._showDelayed.next(this._showDelayedValue);

      this._onlyPositiveValue = false; // Set to default.
      this._onlyUnblockedValue = false;

      const onlyValue = pm.only as string;
      if (onlyValue) {
        const onlyParams = onlyValue.split(",");
        if (onlyParams.includes(OnlyValues.positive)) {
          this._onlyPositiveValue = true;
        }
        if (onlyParams.includes(OnlyValues.unblocked)) {
          this._onlyUnblockedValue = true;
        }
      }

      this._onlyPositive.next(this._onlyPositiveValue);
      this._onlyUnblocked.next(this._onlyUnblockedValue);
    });
  }
}
