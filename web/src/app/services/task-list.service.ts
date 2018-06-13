import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";

import { TaskList } from "./models/task-list.dto";

import { ApiService } from "./api.service";

@Injectable()
export class TaskListService implements Repository<TaskList> {
  private _repository: Repository<TaskList>;

  public get entries(): Observable<TaskList[]> {
    return this._repository.entries;
  }

  constructor(
    apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task-list");
  }

  add(value: TaskList): Promise<TaskList> {
    return this._repository.add(value);
  }

  update(value: TaskList): Promise<TaskList> {
    return this._repository.update(value);
  }

  delete(value: TaskList): Promise<TaskList> {
    return this._repository.delete(value);
  }

  removeMany(values: TaskList[]): Promise<TaskList[]> {
    return this._repository.removeMany(values);
  }
}
