import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { TaskEventService } from "./task-event.service";

import { Task } from "../models";
import { Repository, MessageBusService } from "./message-bus";

function fixDate(v: string | Date) {
  if (typeof (v) === "string") {
    return new Date(Date.parse(v));
  }

  return v;
}

function taskRevive(key: keyof Task, value): any {
  if (key === "createdOn") { return fixDate(value); }
  if (key === "updatedOn") { return fixDate(value); }
  if (key === "completedOn") { return fixDate(value); }
  return value;
}

@Injectable()
export class TaskService {
  private _repository: Repository<Task>;

  public get entries(): Observable<Task[]> {
    return this._repository.entities.pipe(filter(x => !!x));
  }

  constructor(
    private readonly messageBusService: MessageBusService,
    private taskEventService: TaskEventService,
  ) {
    this.setup();
  }

  private setup() {
    const sender = this.messageBusService.createSender<Task>("task", taskRevive);
    const receiver = this.messageBusService.createReceiver<Task>("task", taskRevive);

    this._repository = new Repository(sender, receiver);

    this.messageBusService.status
      .pipe(filter(x => x.status === "accepted"))
      .subscribe(() => {
        this._repository.sync();
      });
  }

  add(value: Task): Promise<Task> {
    if (!value.createdOn) {
      value.createdOn = new Date();
    }
    if (!value.updatedOn) {
      value.updatedOn = new Date();
    }

    value.description = value.description || "";
    return this._repository.add(value).toPromise();
  }

  update(value: Task): Promise<Task> {
    value.updatedOn = new Date();
    return this._repository.update(value).toPromise();
  }

  delete(value: Task): Promise<Task> {
    return this._repository.remove(value)
      .toPromise()
      .then(() => value)
      .then(x => {
        this.taskEventService.deleted(value);
        return x;
      });
  }
}
