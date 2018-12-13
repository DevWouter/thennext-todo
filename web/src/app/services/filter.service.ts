import { Injectable } from '@angular/core';
import { TaskList } from '../models';
import { Observable } from 'rxjs';

@Injectable()
export class FilterService {
  public filteredLists: Observable<TaskList[]>;

  constructor() {

  }

  addList(list: TaskList) { }
}
