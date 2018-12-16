import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { TaskList } from '../../models';
import { TasklistEventService } from './tasklist-event.service';

@Injectable()
export class TasklistFilterService {

  private readonly _filteredLists: TaskList[] = [];
  private readonly $filteredLists = new BehaviorSubject<TaskList[]>(this._filteredLists);

  public get filteredLists(): Observable<TaskList[]> {
    return this.$filteredLists;
  };

  constructor(
    private readonly tasklistEventService: TasklistEventService,
  ) {
    this.setup();
  }

  setup(): void {
    this.tasklistEventService.deletedTasklist.subscribe(list => {
      const index = this._filteredLists.findIndex(x => x.uuid == list.uuid);
      if (index === -1) {
        return;
      }

      this.removeList(list);
    });
  }

  addList(list: TaskList) {
    if (this._filteredLists.find(x => x.uuid === list.uuid)) {
      throw new Error("list is already in filter and can't be added a second time");
    }

    this._filteredLists.push(list);
    this.$filteredLists.next(this._filteredLists);
  }

  removeList(list: TaskList) {
    const index = this._filteredLists.findIndex(x => x.uuid == list.uuid);
    if (index === -1) {
      throw new Error("unable to remove list since it is not part of the filter");
    }

    this._filteredLists.splice(index, 1);
    this.$filteredLists.next(this._filteredLists);
  }

  clear() {
    this._filteredLists.splice(0, this._filteredLists.length);
    this.$filteredLists.next(this._filteredLists);
  }
}
