import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";

import { ApiService } from "./api.service";

import { TaskListRight } from "./models/task-list-right.dto";
import { TaskListService } from "./task-list.service";
import { DirectApiResource } from "./repositories/direct-api-resource";


@Injectable()
export class TaskListRightService {
  private _repository: Repository<TaskListRight>;
  private _directApi: DirectApiResource;
  public get entries(): Observable<TaskListRight[]> {
    return this._repository.entries;
  }

  constructor(
    private readonly apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task-list-right");
    this._directApi = new DirectApiResource(apiService, "/api/task-list-right");
  }

  async accept(taskListUuid: string, token: string): Promise<boolean> {
    const acceptPromise = this._directApi.post("create", {
      tasklistUuid: taskListUuid,
      shareToken: token
    }).toPromise();

    await acceptPromise;

    // Dirty hack to reload the token.
    const sessionToken = await this.apiService.sessionToken.toPromise();
    this.apiService.setSessionToken(sessionToken);

    return Promise.resolve(true);
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
