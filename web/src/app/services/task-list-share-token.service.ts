import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Repository } from "./repositories/repository";
import { WsRepository } from "./repositories/ws-repository";

import { MessageService } from "./message.service";
import { TaskListShareToken } from "../models";


@Injectable()
export class TaskListShareTokenService {
  private _repository: Repository<TaskListShareToken>;
  public get entries(): Observable<TaskListShareToken[]> {
    return this._repository.entries;
  }

  constructor(
    messageService: MessageService,
  ) {
    this._repository = new WsRepository("task-list-share", messageService);
  }

  async add(value: TaskListShareToken): Promise<TaskListShareToken> {
    const result = await this._repository.add(value);
    console.log(result);
    return result;
  }

  update(value: TaskListShareToken): Promise<TaskListShareToken> {
    return this._repository.update(value);
  }

  delete(value: TaskListShareToken): Promise<TaskListShareToken> {
    return this._repository.delete(value);
  }
}
