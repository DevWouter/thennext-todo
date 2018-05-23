import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { ChecklistItem } from "./models/checklist-item.dto";
import { Task, TaskStatus } from "./models/task.dto";
import { TaskList } from "./models/task-list.dto";

import { ChecklistItemService } from "./checklist-item.service";
import { NavigationService } from "./navigation.service";
import { SearchService } from "./search.service";
import { TaskListService } from "./task-list.service";
import { TaskService } from "./task.service";
import { TaskViewService } from "./task-view.service";
import { TaskRelationService } from "./task-relation.service";
import { RelationViewService } from "./relation-view.service";
import { TaskScoreService } from "./task-score.service";
import { combineLatest } from "rxjs/operators";

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
    private searchService: SearchService,
    private taskListService: TaskListService,
    private taskService: TaskService,
    private taskViewService: TaskViewService,
    private relationViewService: RelationViewService,
    private taskScoreService: TaskScoreService,
  ) {
    this.setupActiveTaskList();
    this.setupActiveTask();
    this.setupActiveChecklistItems();
  }

  private setupActiveTaskList() {
    this.navigationService.taskListUuid.pipe(combineLatest(this.taskListService.entries,
      (uuid, tasklists) => {
        this._activeTaskList.next(
          tasklists.find(x => x.uuid === uuid || x.primary && uuid === undefined));
      })).subscribe();
  }

  private setupActiveTask() {
    this.navigationService.taskUuid.pipe(combineLatest(this.taskService.entries, (uuid, tasks) => {
      if (!uuid) {
        // No task is selected.
        this._activeTask.next(undefined);
        return;
      }

      this._activeTask.next(tasks.find(task => task.uuid === uuid));
    })).subscribe();
  }

  private setupActiveChecklistItems(): void {
    this.navigationService.taskUuid.pipe(combineLatest(this.checklistItemService.entries,
      (uuid, items) => {
        this._activeTaskChecklistItems.next(items.filter(x => x.taskUuid === uuid));
      })).subscribe();
  }

  public setDragStatus(v: boolean, taskUuid: string) {
    this._taskDragStatus.next(v);
    this._taskDragging.next(taskUuid);
  }
}
