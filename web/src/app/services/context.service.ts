import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { ChecklistItem } from "./models/checklist-item.dto";
import { Task, TaskStatus } from "./models/task.dto";
import { TaskList } from "./models/task-list.dto";
import { TaskView } from "./models/task-view";

import { ChecklistItemService } from "./checklist-item.service";
import { NavigationService } from "./navigation.service";
import { SearchService } from "./search.service";
import { TaskListService } from "./task-list.service";
import { TaskService } from "./task.service";
import { TaskViewService } from "./task-view.service";


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

  get visibleTasks(): Observable<TaskView[]> {
    return this.activeTaskList.filter(x => !!x)
      .combineLatest(this.taskViewService.entries, (list, tasks) => tasks.filter(x => x.task.taskListUuid === list.uuid))
      .map(x => x.sort((a, b) => b.score - a.score))
      .map(x => {
        const activeTasks: TaskView[] = [];
        const todoTasks: TaskView[] = [];
        const doneTasks: TaskView[] = [];
        x.forEach(y => {
          switch (y.task.status) {
            case TaskStatus.done: { doneTasks.push(y); break; }
            case TaskStatus.active: { activeTasks.push(y); break; }
            case TaskStatus.todo: { todoTasks.push(y); break; }
            default: { throw new Error(`Unsupported task status: ${y.task.status}`); }
          }
        });

        return [...activeTasks, ...todoTasks, ...doneTasks];
      }).combineLatest(this.navigationService.showCompleted, (tasks, showCompleted) => {
        if (!showCompleted) {
          return tasks.filter(y => y.task.status !== TaskStatus.done);
        }
        return tasks;
      })
      .combineLatest(this.navigationService.showDelayed, (tasks, showDelayed) => {
        if (!showDelayed) {
          return tasks.filter(y => !y.isDelayed);
        }
        return tasks;
      })
      .combineLatest(this.navigationService.onlyUnblocked, (tasks, onlyUnblocked) => {
        if (onlyUnblocked) {
          return tasks.filter(y => !y.isBlocked);
        }
        return tasks;
      })
      .combineLatest(this.navigationService.onlyPositive, (tasks, onlyPositive) => {
        if (onlyPositive) {
          return tasks.filter(y => y.score >= 0);
        }
        return tasks;
      })
      .combineLatest(this.navigationService.search, (tasks, search) => {
        if (search) {
          return tasks.filter(x => this.searchService.isResult(x, search));
        }
        return tasks;
      })
      ;
  }

  constructor(
    private checklistItemService: ChecklistItemService,
    private navigationService: NavigationService,
    private searchService: SearchService,
    private taskListService: TaskListService,
    private taskService: TaskService,
    private taskViewService: TaskViewService,
  ) {
    this.setupActiveTaskList();
    this.setupActiveTask();
    this.setupActiveChecklistItems();
  }

  private setupActiveTaskList() {
    this.navigationService.taskListUuid.combineLatest(this.taskListService.entries,
      (uuid, tasklists) => {
        this._activeTaskList.next(
          tasklists.find(x => x.uuid === uuid || x.primary && uuid === undefined));
      }).subscribe();
  }

  private setupActiveTask() {
    this.navigationService.taskUuid.combineLatest(this.taskService.entries, (uuid, tasks) => {
      if (!uuid) {
        // No task is selected.
        this._activeTask.next(undefined);
        return;
      }

      this._activeTask.next(tasks.find(task => task.uuid === uuid));
    }).subscribe();
  }

  private setupActiveChecklistItems(): void {
    this.navigationService.taskUuid.combineLatest(this.checklistItemService.entries,
      (uuid, items) => {
        this._activeTaskChecklistItems.next(items.filter(x => x.taskUuid === uuid));
      }).subscribe();
  }

  public setDragStatus(v: boolean, taskUuid: string) {
    this._taskDragStatus.next(v);
    this._taskDragging.next(taskUuid);
  }
}
