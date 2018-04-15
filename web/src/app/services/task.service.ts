import { Injectable } from "@angular/core";
import gql from "graphql-tag";

import { ApiService } from ".";
import { getTasksQuery, TaskStatus } from "./graphql-types/operation-result-types";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

const GET_TASKS = gql`
query getTasks {
  tasks{
    uuid
    taskListUuid
    title
    status
  }
}
`;

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
    this.subscribeToTasks();
  }


  private subscribeToTasks(): void {
    const query = this.apiService.apollo.watchQuery({
      query: GET_TASKS,
      fetchPolicy: "cache-first",
    });

    query.valueChanges.subscribe((x) => {
      const data = x.data as getTasksQuery;
      if (data) {
        this._tasks.next(data.tasks);
      }
    });
  }

  parseCommand(command: string): any {
    throw new Error("Method not implemented.");
  }

}
