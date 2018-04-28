import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";
import { RepositoryEventHandler } from "./repositories/repository-event-handler";

import { ApiService } from "./api.service";

import { Task } from "./models/task.dto";
import { TaskEventService } from "./task-event.service";

class TaskEventHandler implements RepositoryEventHandler<Task> {
  onItemLoad(entry: Task): void {
    entry.createdOn = this.fixDate(entry.createdOn);
    entry.updatedOn = this.fixDate(entry.updatedOn);
    entry.completedOn = this.fixDate(entry.completedOn);
    entry.sleepUntil = this.fixDate(entry.sleepUntil);
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
    private taskEventService: TaskEventService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task", new TaskEventHandler());
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
    return this._repository.delete(value)
      .then(x => {
        this.taskEventService.deleted(value);
        return x;
      });
  }

  deleteMany(values: Task[]): Promise<Task[]> {
    return this._repository.deleteMany(values)
      .then(x => {
        x.forEach(y => this.taskEventService.deleted(y));
        return x;
      });
  }

  delay(value: Task, sleepUntil: Date): Promise<Task> {
    value.sleepUntil = sleepUntil;
    return this.update(value);
  }
}
