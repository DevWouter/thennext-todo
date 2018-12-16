import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { TaskList } from "../../models";

@Injectable()
export class TasklistEventService {

  private _deletedTasklist = new Subject<TaskList>();
  get deletedTasklist(): Observable<TaskList> { return this._deletedTasklist; }

  constructor() { }

  /**
   * Called when a tasklist has been deleted.
   * @param tasklist The tasklist that was deleted
   */
  deleted(tasklist: TaskList): void {
    this._deletedTasklist.next(tasklist);
  }
}
