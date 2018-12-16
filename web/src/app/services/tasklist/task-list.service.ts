import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { TaskList } from "../../models";
import { Repository, MessageBusService, RepositoryFactoryService } from "../message-bus";
import { filter } from "rxjs/operators";

@Injectable()
export class TaskListService {
  private _repository: Repository<TaskList>;

  public get entries(): Observable<TaskList[]> {
    return this._repository.entities;
  }

  constructor(
    readonly messageBusService: MessageBusService,
    readonly repositoryFactory: RepositoryFactoryService,
  ) {
    const sender = this.messageBusService.createSender<TaskList>("task-list", undefined);
    const receiver = this.messageBusService.createReceiver<TaskList>("task-list", undefined);

    this._repository = repositoryFactory.create(sender, receiver);

    this.messageBusService.status
      .pipe(filter(x => x.status === "accepted"))
      .subscribe(() => {
        this._repository.sync();
      });
  }

  add(value: TaskList): Observable<TaskList> {
    return this._repository.add(value);
  }

  update(value: TaskList): Observable<TaskList> {
    return this._repository.update(value);
  }

  delete(value: TaskList): Observable<void> {
    return this._repository.remove(value);
  }
}
