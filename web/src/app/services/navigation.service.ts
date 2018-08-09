import { Injectable } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras, Params } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

import { TaskListService } from "./task-list.service";
import { StorageService, StorageKey } from "./storage.service";

import { TaskPageNavigation } from "../models";

enum ShowValues {
  completed = "completed",
  blocked = "blocked",
  negative = "negative"
}

@Injectable()
export class NavigationService {
  private _primaryTaskListUuid: string = undefined;
  private _taskListUuidValue: string = undefined;
  private _taskUuidValue: string = undefined;
  private _searchValue: string = undefined;
  private _showCompletedValue = false;
  private _showBlockedValue = false;
  private _showNegativeValue = false;
  private _taskListUuid = new BehaviorSubject<string>(this._taskListUuidValue);
  private _taskUuid = new BehaviorSubject<string>(this._taskUuidValue);
  private _showCompleted = new BehaviorSubject<boolean>(this._showCompletedValue);
  private _showBlocked = new BehaviorSubject<boolean>(this._showBlockedValue);
  private _showNegative = new BehaviorSubject<boolean>(this._showNegativeValue);
  private _search = new BehaviorSubject<string>(this._searchValue);

  public get taskListUuid(): Observable<string> { return this._taskListUuid; }
  public get taskUuid(): Observable<string> { return this._taskUuid; }
  public get showCompleted(): Observable<boolean> { return this._showCompleted; }
  public get showBlocked(): Observable<boolean> { return this._showBlocked; }
  public get showNegative(): Observable<boolean> { return this._showNegative; }
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
    if (params.showCompleted !== undefined) {
      this._showCompletedValue = params.showCompleted;
    }

    if (params.showNegative !== undefined) {
      this._showNegativeValue = params.showNegative;
    }

    if (params.showBlocked !== undefined) {
      this._showBlockedValue = params.showBlocked;
    }

    if (this._showCompletedValue) {
      showParams.push(ShowValues.completed);
    }

    if (this._showNegativeValue) {
      showParams.push(ShowValues.negative);
    }

    if (this._showBlockedValue) {
      showParams.push(ShowValues.blocked);
    }

    let show = showParams.join(",");
    if (show === "") {
      show = null;
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

      // Set to default
      this._showCompletedValue = false;
      this._showNegativeValue = false;
      this._showBlockedValue = false;

      const showValue = pm.show as string;
      if (showValue) {
        const showParams = showValue.split(",");
        if (showParams.includes(ShowValues.completed)) {
          this._showCompletedValue = true;
        }
        if (showParams.includes(ShowValues.negative)) {
          this._showNegativeValue = true;
        }
        if (showParams.includes(ShowValues.blocked)) {
          this._showBlockedValue = true;
        }
      }

      this._showCompleted.next(this._showCompletedValue);
      this._showNegative.next(this._showNegativeValue);
      this._showBlocked.next(this._showBlockedValue);
    });
  }
}
