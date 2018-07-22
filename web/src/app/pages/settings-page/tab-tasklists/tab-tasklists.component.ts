import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';

import { TaskListService, AccountService } from '../../../services';
import { TaskList } from '../../../models';

@Component({
  selector: 'settings-tab-tasklists',
  templateUrl: './tab-tasklists.component.html',
  styleUrls: ['./tab-tasklists.component.scss']
})
export class SettingsTasklistsComponent implements OnInit {
  tasklists: TaskList[] = [];
  newTaskListName = "";
  private myUuid: string;

  constructor(
    private readonly accountService: AccountService,
    private readonly tasklistService: TaskListService,
  ) { }

  ngOnInit(): void {
    this.tasklistService.entries.subscribe(x => this.tasklists = x);
    this.accountService.myAccount
      .pipe(filter(x => !!x))
      .subscribe(x => this.myUuid = x.uuid);
  }

  delete(item: TaskList) {
    console.log("Deleting", item);
    this.tasklistService.delete(item);
  }

create() {
    const name = (this.newTaskListName || "").trim();
    this.newTaskListName = "";
    if (name.length <= 0) {
      return;
    }

    this.tasklistService.add(<TaskList>{
      ownerUuid: this.myUuid,
      name: name,
    });
  }
}
