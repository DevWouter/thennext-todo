import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { TaskListShareToken } from "../models";
import { Repository, MessageBusService } from "./message-bus";


@Injectable()
export class TaskListShareTokenService {
  private _repository: Repository<TaskListShareToken>;
  public get entries(): Observable<TaskListShareToken[]> {
    return this._repository.entities;
  }

  constructor(
    private readonly messageBusService: MessageBusService,
  ) {

    const sender = this.messageBusService.createSender<TaskListShareToken>("task-list-share", undefined);
    const receiver = this.messageBusService.createReceiver<TaskListShareToken>("task-list-share", undefined);

    this._repository = new Repository(sender, receiver);

    this.messageBusService.status
      .pipe(filter(x => x.status === "accepted"))
      .subscribe(() => {
        this._repository.sync();
      });
  }

  add(value: TaskListShareToken): Promise<TaskListShareToken> {
    return this._repository.add(value).toPromise();
  }

  update(value: TaskListShareToken): Promise<TaskListShareToken> {
    return this._repository.update(value).toPromise();
  }

  delete(value: TaskListShareToken): Promise<TaskListShareToken> {
    return this._repository.remove(value).toPromise().then(() => value);
  }
}
