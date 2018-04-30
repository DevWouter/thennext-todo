import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

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

  get visibleTasks(): Observable<Task[]> {
    return this.activeTaskList.filter(x => !!x)
      .combineLatest(this.taskService.entries, (list, tasks) => tasks.filter(x => x.taskListUuid === list.uuid))
      .combineLatest(this.taskScoreService.taskScores, (tasks, scores) => {
        return scores.map(s => tasks.find(t => t.uuid === s.taskUuid)).filter(y => !!y);
      })
      .map(x => {
        const activeTasks: Task[] = [];
        const todoTasks: Task[] = [];
        const doneTasks: Task[] = [];
        x.forEach(y => {
          switch (y.status) {
            case TaskStatus.done: { doneTasks.push(y); break; }
            case TaskStatus.active: { activeTasks.push(y); break; }
            case TaskStatus.todo: { todoTasks.push(y); break; }
            default: { throw new Error(`Unsupported task status: ${y.status}`); }
          }
        });

        return [...activeTasks, ...todoTasks, ...doneTasks];
      }).combineLatest(this.navigationService.showCompleted, (tasks, showCompleted) => {
        if (!showCompleted) {
          return tasks.filter(y => y.status !== TaskStatus.done);
        }
        return tasks;
      })
      // .combineLatest(this.navigationService.showDelayed, (tasks, showDelayed) => {
      //   if (!showDelayed) {
      //     return tasks.filter(y => !y.isDelayed);
      //   }
      //   return tasks;
      // })
      .combineLatest(this.navigationService.onlyUnblocked, this.relationViewService.blockedTaskUuids,
        (tasks, onlyUnblocked, blockedUuids) => {
          if (onlyUnblocked) {
            return tasks.filter(y => !blockedUuids.includes(y.uuid));
          }
          return tasks;
        })
      .combineLatest(this.navigationService.onlyPositive, this.taskScoreService.taskScores,
        (tasks, onlyPositive, scores) => {
          if (onlyPositive) {
            return tasks.filter(task => {
              const taskScore = scores.find(s => s.taskUuid === task.uuid);
              if (taskScore) {
                return taskScore.score >= 0;
              }
              return true; // No score, so we can assume 0.
            });
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
    private relationViewService: RelationViewService,
    private taskScoreService: TaskScoreService,
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
