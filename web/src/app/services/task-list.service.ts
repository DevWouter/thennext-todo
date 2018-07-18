import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Repository } from "./repositories/repository";
import { WsRepository } from "./repositories/ws-repository";

import { MessageService } from "./message.service";
import { TaskList } from "../models";

@Injectable()
export class TaskListService implements Repository<TaskList> {
  private _repository: Repository<TaskList>;

  public get entries(): Observable<TaskList[]> {
    return this._repository.entries;
  }

  constructor(
    readonly messageService: MessageService,
  ) {
    this._repository = new WsRepository("task-list", messageService);
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
