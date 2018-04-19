import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { TaskListService } from "./task-list.service";
import { TaskList } from "./models/task-list.dto";
import { NavigationService } from ".";


@Injectable()
export class ContextService {
  private _activeTaskList = new BehaviorSubject<TaskList>(undefined);

  get activeTaskList(): Observable<TaskList> {
    return this._activeTaskList;
  }

  constructor(
    private navigationService: NavigationService,
    private taskListService: TaskListService,
  ) {

    this.setupActiveTaskList();

  }

  private setupActiveTaskList() {
    this.navigationService.taskListUuid.combineLatest(this.taskListService.entries,
      (uuid, tasklists) => {
        this._activeTaskList.next(
          tasklists.find(x => x.uuid === uuid || x.primary && uuid === undefined));
      }).subscribe();
  }
}
