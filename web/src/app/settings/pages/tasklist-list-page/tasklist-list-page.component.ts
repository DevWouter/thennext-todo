import { Component, OnInit } from "@angular/core";
import { TaskList } from "../../../models";
import { TaskListService, AccountService } from "../../../services";
import { Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";

@Component({
  selector: "app-settings-page-tab-tasklists",
  templateUrl: "./tasklist-list-page.component.html",
  styleUrls: ["./tasklist-list-page.component.scss"]
})
export class TasklistListPageComponent implements OnInit {

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
