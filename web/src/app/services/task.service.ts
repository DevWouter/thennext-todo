import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";
import { RepositoryRestoreTranslator } from "./repositories/repository-restore-translator";

import { ApiService } from "./api.service";

import { Task } from "./models/task.dto";

class TaskRestoreTranslator implements RepositoryRestoreTranslator<Task> {
  translate(entry: Task): void {
    entry.updatedOn = this.fixDate(entry.updatedOn);
    entry.completedOn = this.fixDate(entry.updatedOn);
    entry.createdOn = this.fixDate(entry.updatedOn);
  }

  fixDate(v: string | Date): Date {
    if (v === null || v === undefined) {
      return undefined;
    }

    if (typeof (v) === "string") {
      const vs = <string>(v);
      return new Date(Date.parse(vs));
    }

    // We can assume it is a date.
    return <Date>v;
  }
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
    this._repository = new ApiRepository(apiService, "/api/task", new TaskRestoreTranslator());
  }

  add(value: Task): Promise<Task> {
    if (!value.createdOn) {
      value.createdOn = new Date();
    }
    if (!value.updatedOn) {
      value.updatedOn = new Date();
    }

    value.description = value.description || "";
    return this._repository.add(value);
  }

  update(value: Task): Promise<Task> {
    value.updatedOn = new Date();
    return this._repository.update(value);
  }

  delete(value: Task): Promise<Task> {
    return this._repository.delete(value);
  }

  deleteMany(values: Task[]): Promise<Task[]> {
    return this._repository.deleteMany(values);
  }
}
