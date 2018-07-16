import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, combineLatest } from "rxjs";


import { ChecklistItem } from "./models/checklist-item.dto";
import { Task } from "./models/task.dto";
import { TaskList } from "./models/task-list.dto";

import { ChecklistItemService } from "./checklist-item.service";
import { NavigationService } from "./navigation.service";
import { TaskListService } from "./task-list.service";
import { TaskService } from "./task.service";

@Injectable()
export class ContextService {
  private _activeTaskList = new BehaviorSubject<TaskList>(undefined);
  private _activeTask = new BehaviorSubject<Task>(undefined);

  private _activeTaskChecklistItems = new BehaviorSubject<ChecklistItem[]>([]);

  private _taskDragStatus = new BehaviorSubject<boolean>(false);
  private _taskDragging = new BehaviorSubject<string>(undefined);

  get activeTaskList(): Observable<TaskList> { return this._activeTaskList; }
  get activeTask(): Observable<Task> { return this._activeTask; }

  get activeTaskChecklistItems(): Observable<ChecklistItem[]> { return this._activeTaskChecklistItems; }
  get taskDragStatus(): Observable<boolean> { return this._taskDragStatus.asObservable(); }

  get taskDragging(): Observable<string> { return this._taskDragging.asObservable(); }

  constructor(
    private checklistItemService: ChecklistItemService,
    private navigationService: NavigationService,
    private taskListService: TaskListService,
    private taskService: TaskService,
  ) {
    this.setupActiveTaskList();
    this.setupActiveTask();
    this.setupActiveChecklistItems();
  }

  private setupActiveTaskList() {
    combineLatest(this.navigationService.taskListUuid, this.taskListService.entries)
      .subscribe(([uuid, tasklists]) => {
        this._activeTaskList.next(
          tasklists.find(x => x.uuid === uuid || x.primary && uuid === undefined));
      });
  }

  private setupActiveTask() {
    combineLatest(this.navigationService.taskUuid, this.taskService.entries)
      .subscribe(([uuid, tasks]) => {
        if (!uuid) {
          // No task is selected.
          this._activeTask.next(undefined);
          return;
        }

        this._activeTask.next(tasks.find(task => task.uuid === uuid));
      });
  }

  private setupActiveChecklistItems(): void {
    combineLatest(this.navigationService.taskUuid, this.checklistItemService.entries)
      .subscribe(([uuid, items]) => {
        this._activeTaskChecklistItems.next(items.filter(x => x.taskUuid === uuid));
      });
  }

  public setDragStatus(v: boolean, taskUuid: string) {
    this._taskDragStatus.next(v);
    this._taskDragging.next(taskUuid);
  }
}
