import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { Repository } from "./repositories/repository";
import { ApiRepository } from "./repositories/api-repository";

import { ApiService } from "./api.service";

import { Task } from "./models/task.dto";

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
