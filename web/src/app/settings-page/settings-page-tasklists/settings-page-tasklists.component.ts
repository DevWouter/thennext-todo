import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TaskList } from "../../services/models/task-list.dto";
import { TaskListService } from "../../services/task-list.service";
import { AccountService } from "../../services/account.service";
import { combineLatest } from "rxjs";
import { map, filter } from "rxjs/operators";

@Component({
  selector: "app-settings-page-tasklists",
  templateUrl: "./settings-page-tasklists.component.html",
  styleUrls: ["./settings-page-tasklists.component.scss"]
})
export class SettingsPageTasklistsComponent implements OnInit {
  tasklists: TaskList[];
  ownedTasklists: TaskList[];
  otherTasklists: TaskList[];
  newTaskListName: string;

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
      console.log(combo);
      const myUuid = combo.myAccount.uuid;
      this.ownedTasklists = combo.tasklists.filter(x => x.ownerUuid === myUuid);
      this.otherTasklists = combo.tasklists.filter(x => x.ownerUuid !== myUuid);
    });

    this.tasklistService.entries
      .subscribe(tasklists => this.tasklists = tasklists);
  }

  delete(tasklist: TaskList) {
    this.tasklistService.delete(tasklist);
  }

  create() {
    const name = (this.newTaskListName || "").trim();
    this.newTaskListName = "";
    if (name.length === 0) {
      return;
    }

    this.tasklistService.add(<TaskList>{ name: name });
  }


}
