import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { TaskListRight } from "../models";
import { Repository, MessageBusService } from "./message-bus";
import { filter } from "rxjs/operators";

@Injectable()
export class TaskListRightService {
  private _repository: Repository<TaskListRight>;
  public get entries(): Observable<TaskListRight[]> {
    return this._repository.entities;
  }

  constructor(
    private readonly messageBusService: MessageBusService,
  ) {
    const sender = this.messageBusService.createSender<TaskListRight>("task-list-right", undefined);
    const receiver = this.messageBusService.createReceiver<TaskListRight>("task", undefined);

    this._repository = new Repository(sender, receiver);

    this.messageBusService.status
      .pipe(filter(x => x.status === "accepted"))
      .subscribe(() => {
        this._repository.sync();
      });
  }

  async accept(taskListUuid: string, token: string): Promise<boolean> {
    throw new Error("Not yet implemented.");
  }

  add(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.add(value).toPromise();
  }

  update(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.update(value).toPromise();
  }

  delete(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.remove(value).toPromise().then(() => value);
  }
}
