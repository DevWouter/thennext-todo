import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { TaskListService } from "./task-list.service";
import { TaskList } from "./models/task-list.dto";
import { NavigationService } from ".";
import { Task, TaskStatus } from "./models/task.dto";
import { TaskService } from "./task.service";
import { TaskView } from "./models/task-view";
import { TaskViewService } from "./task-view.service";


@Injectable()
export class ContextService {
  private _activeTaskList = new BehaviorSubject<TaskList>(undefined);
  private _activeTask = new BehaviorSubject<TaskView>(undefined);

  get activeTaskList(): Observable<TaskList> { return this._activeTaskList; }
  get activeTaskView(): Observable<TaskView> { return this._activeTask; }

  get visibleTasks(): Observable<TaskView[]> {
    return this.activeTaskList.filter(x => !!x)
      .combineLatest(this.taskViewService.entries, (list, tasks) => tasks.filter(x => x.task.taskListUuid === list.uuid))
      .map(x => x.filter(y => y.task.status !== TaskStatus.done));
  }

  constructor(
    private navigationService: NavigationService,
    private taskListService: TaskListService,
    private taskViewService: TaskViewService,
  ) {
    this.setupActiveTaskList();
    this.setupActiveTask();
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
}
