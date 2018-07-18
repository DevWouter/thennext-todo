import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { map, filter } from "rxjs/operators";

import { TaskList } from "../../models";
import { AccountService, TaskListService } from "../../services";

@Component({
  selector: "app-settings-page-tasklists",
  templateUrl: "./settings-page-tasklists.component.html",
  styleUrls: ["./settings-page-tasklists.component.scss"]
})
export class SettingsPageTasklistsComponent implements OnInit {
  tasklists: TaskList[];
  ownedTasklists: TaskList[];
  otherTasklists: TaskList[];
  myUuid: string;

  constructor(
    private accountService: AccountService,
    private tasklistService: TaskListService,
    private router: Router,
  ) { }

  ngOnInit() {
    const entriesWithAccount = combineLatest(
      this.tasklistService.entries.pipe(filter(x => !!x)),
      this.accountService.myAccount.pipe(filter(x => !!x))
    )
      .pipe(
        map(([tasklists, myAccount]) => ({
          tasklists: tasklists,
          myAccount: myAccount
        }))
      );

    entriesWithAccount.subscribe(combo => {
      this.myUuid = combo.myAccount.uuid;
      this.ownedTasklists = combo.tasklists.filter(x => x.ownerUuid === this.myUuid);
      this.otherTasklists = combo.tasklists.filter(x => x.ownerUuid !== this.myUuid);
    });

    this.tasklistService.entries
      .subscribe(tasklists => this.tasklists = tasklists);
  }

}
