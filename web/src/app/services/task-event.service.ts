import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Task } from "./models/task.dto";
import { Observable } from "rxjs/Observable";

@Injectable()
export class TaskEventService {

  private _deletedTask = new Subject<Task>();
  get deletedTask(): Observable<Task> { return this._deletedTask; }

  constructor() { }

  /**
   * Called when a task has been deleted.
   * @param task The task that was deleted
   */
  deleted(task: Task): void {
    this._deletedTask.next(task);
  }

}
