import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";

import { ApiService } from "./api.service";

import { TaskListShareToken } from "./models/task-list-share-token.dto";


@Injectable()
export class TaskListShareTokenService {
  private _repository: Repository<TaskListShareToken>;
  public get entries(): Observable<TaskListShareToken[]> {
    return this._repository.entries;
  }

  constructor(
    apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task-list-share");
  }

  async add(value: TaskListShareToken): Promise<TaskListShareToken> {
    const result = await this._repository.add(value);
    console.log(result);
    return result;
  }

  update(value: TaskListShareToken): Promise<TaskListShareToken> {
    return this._repository.update(value);
  }

  delete(value: TaskListShareToken): Promise<TaskListShareToken> {
    return this._repository.delete(value);
  }
}
