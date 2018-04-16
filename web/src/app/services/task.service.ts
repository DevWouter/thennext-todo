import { Injectable } from "@angular/core";

import { ApiService } from ".";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

export enum TaskStatus {
  todo = "todo",
  active = "active",
  done = "done",
}

export interface Task {
  uuid: string;
  taskListUuid: string;
  title: string;
  status: TaskStatus;
}

@Injectable()
export class TaskService {
  private _tasks = new BehaviorSubject<Task[]>(undefined);
  public get tasks(): Observable<Task[]> {
    return this._tasks.filter(x => x !== undefined);
  }

  constructor(
    private apiService: ApiService,
  ) {
  }

  parseCommand(command: string): any {
    throw new Error("Method not implemented.");
  }

}
