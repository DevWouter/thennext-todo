import { Injectable } from "@angular/core";
import { ApiService } from ".";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

interface TaskList {
  uuid: string;
  name: string;
  primary: boolean;
}

@Injectable()
export class TaskListService {
  private _taskLists = new BehaviorSubject<TaskList[]>(undefined);
  public get taskLists(): Observable<TaskList[]> {
    return this._taskLists.filter(x => x !== undefined);
  }

  constructor(
    private apiService: ApiService,
  ) {
    this.pullTaskList();
  }

  createTaskList(name: string): void {
    this.apiService
      .post("/api/task-list/", { name: name })
      .subscribe(() => { this.pullTaskList(); });
  }

  private pullTaskList() {
    this.apiService.get<TaskList[]>("/api/task-list/").subscribe(x => {
      this._taskLists.next(x);
    });
  }
}
