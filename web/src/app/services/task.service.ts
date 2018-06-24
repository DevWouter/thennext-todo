import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, combineLatest } from "rxjs";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";
import { RepositoryEventHandler } from "./repositories/repository-event-handler";

import { ApiService } from "./api.service";

import { Task, TaskStatus } from "./models/task.dto";
import { TaskEventService } from "./task-event.service";
import { WebSocketService } from "./web-socket.service";
import { filter, map } from "rxjs/operators";

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
    private webSocketService: WebSocketService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task", new TaskEventHandler());
    const updateMessage = this.webSocketService.$taskMessage.pipe(filter(x => x.action === "update"));
    combineLatest(updateMessage, this.entries).pipe(
      map(([msg, entries]) => {
        const src = msg.entity as Task;
        new TaskEventHandler().onItemLoad(src);
        const dst = entries.find(x => x.uuid === src.uuid);
        dst.title = src.title;
        dst.status = src.status;
        dst.description = src.description;
        dst.nextChecklistOrder = src.nextChecklistOrder;
        dst.sleepUntil = src.sleepUntil;
        dst.completedOn = src.completedOn;
        dst.createdOn = src.createdOn;
        dst.taskListUuid = src.taskListUuid;
        dst.updatedOn = src.updatedOn;
      })).subscribe();

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

  delay(value: Task, sleepUntil: Date): Promise<Task> {
    value.sleepUntil = sleepUntil;
    return this.update(value);
  }

  wakeup(value: Task): Promise<Task> {
    value.sleepUntil = null;
    return this.update(value);
  }
}
