import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { TaskList } from "../models";
import { Repository, MessageBusService } from "./message-bus";
import { filter } from "rxjs/operators";

@Injectable()
export class TaskListService {
  private _repository: Repository<TaskList>;

  public get entries(): Observable<TaskList[]> {
    return this._repository.entities;
  }

  constructor(
    readonly messageBusService: MessageBusService,
  ) {
    const sender = this.messageBusService.createSender<TaskList>("task-list", undefined);
    const receiver = this.messageBusService.createReceiver<TaskList>("task-list", undefined);

    this._repository = new Repository(sender, receiver);

    this.messageBusService.status
      .pipe(filter(x => x.status === "accepted"))
      .subscribe(() => {
        this._repository.sync();
      });
  }

  add(value: TaskList): Promise<TaskList> {
    return this._repository.add(value).toPromise();
  }

  update(value: TaskList): Promise<TaskList> {
    return this._repository.update(value).toPromise();
  }

  delete(value: TaskList): Promise<TaskList> {
    return this._repository.remove(value).toPromise().then(() => value);
  }
}
