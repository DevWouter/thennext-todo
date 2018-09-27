import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Repository } from "./repositories/repository";
import { WsRepository } from "./repositories/ws-repository";

import { MessageService } from "./message.service";
import { TaskList } from "../models";
import { ConnectionStateService } from "./connection-state.service";

@Injectable()
export class TaskListService implements Repository<TaskList> {
  private _repository: WsRepository<TaskList>;

  public get entries(): Observable<TaskList[]> {
    return this._repository.entries;
  }

  constructor(
    readonly messageService: MessageService,
    connectionStateService: ConnectionStateService,
  ) {
    this._repository = new WsRepository("task-list", messageService);
    connectionStateService.state.subscribe(x => { if (x === "load") { this._repository.load(); } else { this._repository.unload(); } });
  }

  add(value: TaskList): Promise<TaskList> {
    return this._repository.add(value);
  }

  update(value: TaskList): Promise<TaskList> {
    return this._repository.update(value);
  }

  delete(value: TaskList): Promise<TaskList> {
    return this._repository.delete(value);
  }

  removeMany(values: TaskList[]): Promise<TaskList[]> {
    return this._repository.removeMany(values);
  }
}
