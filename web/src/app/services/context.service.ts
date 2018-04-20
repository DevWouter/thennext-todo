import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { TaskListService } from "./task-list.service";
import { TaskList } from "./models/task-list.dto";
import { NavigationService } from ".";
import { Task, TaskStatus } from "./models/task.dto";
import { TaskService } from "./task.service";


@Injectable()
export class ContextService {
  private _activeTaskList = new BehaviorSubject<TaskList>(undefined);
  private _activeTask = new BehaviorSubject<Task>(undefined);

  get activeTaskList(): Observable<TaskList> { return this._activeTaskList; }
  get activeTask(): Observable<Task> { return this._activeTask; }

  get visibleTasks(): Observable<Task[]> {
    return this.activeTaskList.filter(x => !!x)
      .combineLatest(this.taskService.entries, (list, tasks) => tasks.filter(x => x.taskListUuid === list.uuid))
      .map(x => x.filter(y => y.status !== TaskStatus.done));
  }

  constructor(
    private navigationService: NavigationService,
    private taskListService: TaskListService,
    private taskService: TaskService,
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
    this.navigationService.taskUuid.combineLatest(this.taskService.entries,
      (uuid, tasks) => {
        this._activeTask.next(tasks.find(x => x.uuid === uuid));
      }).subscribe();
  }
}
