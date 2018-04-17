import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { ApiService } from "./api.service";
import { Repository } from "./repositories/repository";
import { ApiRepository } from "./repositories/api-repository";

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
  private _repository: Repository<Task>;
  public get entries(): Observable<Task[]> {
    return this._repository.entries;
  }

  constructor(
    private apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task");
  }

  // TODO: Move this to another service to handle parsing.
  parseCommand(command: string): any {
    throw new Error("Method not implemented.");
  }

  add(value: Task): Promise<Task> {
    return this._repository.add(value);
  }

  update(value: Task): Promise<Task> {
    return this._repository.update(value);
  }

  delete(value: Task): Promise<Task> {
    return this._repository.delete(value);
  }

  deleteMany(values: Task[]): Promise<Task[]> {
    return this._repository.deleteMany(values);
  }
}
