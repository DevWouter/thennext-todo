import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Repository } from "./repositories/repository";
import { WsRepository } from "./repositories/ws-repository";

import { MessageService } from "./message.service";
import { TaskListRight } from "../models";
import { ConnectionStateService } from "./connection-state.service";

@Injectable()
export class TaskListRightService {
  private _repository: WsRepository<TaskListRight>;
  public get entries(): Observable<TaskListRight[]> {
    return this._repository.entries;
  }

  constructor(
    messageService: MessageService,
    connectionStateService: ConnectionStateService,
  ) {
    this._repository = new WsRepository("task-list-right", messageService);
    connectionStateService.state.subscribe(x => { if (x === "load") { this._repository.load(); } else { this._repository.unload(); } });
  }

  async accept(taskListUuid: string, token: string): Promise<boolean> {
    throw new Error("Not yet implemented.");
  }

  add(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.add(value);
  }

  update(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.update(value);
  }

  delete(value: TaskListRight): Promise<TaskListRight> {
    return this._repository.delete(value);
  }
}
