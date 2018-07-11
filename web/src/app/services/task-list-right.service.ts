import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { Repository } from "./repositories/repository";


import { TaskListRight } from "./models/task-list-right.dto";
import { MessageService } from "./message.service";
import { WsRepository } from "./repositories/ws-repository";


@Injectable()
export class TaskListRightService {
  private _repository: Repository<TaskListRight>;
  public get entries(): Observable<TaskListRight[]> {
    return this._repository.entries;
  }

  constructor(
    messageService: MessageService,
  ) {
    this._repository = new WsRepository("task-list-right", messageService);
  }

  async accept(taskListUuid: string, token: string): Promise<boolean> {
    throw new Error("Not yet implemented.");
    // const acceptPromise = this._directApi.post("create", {
    //   tasklistUuid: taskListUuid,
    //   shareToken: token
    // }).toPromise();

    // await acceptPromise;

    // // Dirty hack to reload the token.
    // const sessionToken = await this.apiService.sessionToken.toPromise();
    // this.apiService.setSessionToken(sessionToken);

    // return Promise.resolve(true);
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
