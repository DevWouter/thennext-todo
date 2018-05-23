import { Injectable } from "@angular/core";

import { BehaviorSubject ,  Observable } from "rxjs";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";
import { RepositoryEventHandler } from "./repositories/repository-event-handler";

import { ApiService } from "./api.service";

import { TaskEventService } from "./task-event.service";
import { TaskTimeLap } from "./models/task-time-lap.dto";

class TaskTimeLapEventHandler implements RepositoryEventHandler<TaskTimeLap> {
  onItemLoad(entry: TaskTimeLap): void {
    entry.start = this.fixDate(entry.start);
    entry.end = this.fixDate(entry.end);
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
export class TaskTimeLapService {
  private _repository: Repository<TaskTimeLap>;
  private _internalList: TaskTimeLap[] = [];

  public get entries(): Observable<TaskTimeLap[]> {
    return this._repository.entries;
  }

  constructor(
    private apiService: ApiService,
    private taskEventService: TaskEventService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task-time-lap", new TaskTimeLapEventHandler());
    this._repository.entries.subscribe(x => this._internalList = x);

    this.taskEventService.deletedTask.subscribe(task => {
      const deletedItems = this._internalList.filter(x => x.taskUuid === task.uuid);
      this._repository.removeMany(deletedItems, { onlyInternal: true });
    });
  }

  add(value: TaskTimeLap): Promise<TaskTimeLap> {
    return this._repository.add(value);
  }

  update(value: TaskTimeLap): Promise<TaskTimeLap> {
    return this._repository.update(value);
  }

  delete(value: TaskTimeLap): Promise<TaskTimeLap> {
    return this._repository.delete(value);
  }
}
