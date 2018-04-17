import { Injectable } from "@angular/core";
import { ApiService } from ".";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Entity } from "./repositories/entity";
import { Repository } from "./repositories/repository";
import { ApiRepository } from "./repositories/api-repository";

interface TaskList extends Entity {
  uuid: string;
  name: string;
  primary: boolean;
}

@Injectable()
export class TaskListService implements Repository<TaskList> {
  private _repository: Repository<TaskList>;

  public get entries(): Observable<TaskList[]> {
    return this._repository.entries;
  }

  constructor(
    private apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/task-list/");
  }

  createTaskList(name: string): void {
    this.add(<TaskList>{ name: name });
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

  deleteMany(values: TaskList[]): Promise<TaskList[]> {
    return this._repository.deleteMany(values);
  }
}
