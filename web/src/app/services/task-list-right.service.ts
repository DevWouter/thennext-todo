import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";

import { ApiService } from "./api.service";

import { TaskListRight } from "./models/task-list-right.dto";


@Injectable()
export class TaskListRightService {
  private _repository: Repository<TaskListRight>;
  public get entries(): Observable<TaskListRight[]> {
    return this._repository.entries;
  }

  constructor(
    apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task-list-right");
  }

  add(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.add(value);
  }

  update(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.update(value);
  }

  delete(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.delete(value);
  }
}
