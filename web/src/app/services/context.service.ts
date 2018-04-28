import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { TaskListService } from "./task-list.service";
import { TaskList } from "./models/task-list.dto";
import { Task, TaskStatus } from "./models/task.dto";
import { TaskService } from "./task.service";
import { TaskView } from "./models/task-view";
import { TaskViewService } from "./task-view.service";
import { ChecklistItem } from "./models/checklist-item.dto";
import { ChecklistItemService } from "./checklist-item.service";
import { NavigationService } from "./navigation.service";


@Injectable()
export class ContextService {
  private _activeTaskList = new BehaviorSubject<TaskList>(undefined);
  private _activeTask = new BehaviorSubject<TaskView>(undefined);
  private _activeTaskChecklistItems = new BehaviorSubject<ChecklistItem[]>([]);

  private _taskDragStatus = new BehaviorSubject<boolean>(false);
  private _taskDragging = new BehaviorSubject<string>(undefined);

  get activeTaskList(): Observable<TaskList> { return this._activeTaskList; }
  get activeTaskView(): Observable<TaskView> { return this._activeTask; }
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
      .combineLatest(this.navigationService.onlyUnblocked, (tasks, onlyUnblocked) => {
        if (onlyUnblocked) {
          return tasks.filter(y => !y.isBlocked);
        }
        return tasks;
      })
      ;
  }

  constructor(
    private checklistItemService: ChecklistItemService,
    private navigationService: NavigationService,
    private taskListService: TaskListService,
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
    this.navigationService.taskUuid.combineLatest(this.taskViewService.entries,
      (uuid, taskViews) => {
        this._activeTask.next(taskViews.find(x => x.task.uuid === uuid));
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
