import { Component, OnInit } from "@angular/core";
import { filter } from "rxjs/operators";

import { TaskList } from "../../../../models";

import { TaskListService, AccountService } from "../../../../services";

@Component({
  selector: "settings-create-tasklist",
  templateUrl: "./settings-page-tasklist-creator.component.html",
  styleUrls: ["./settings-page-tasklist-creator.component.scss"]
})
export class SettingsCreateTasklistComponent implements OnInit {
  newTaskListName: string;
  myUuid: string;

  constructor(
    private accountService: AccountService,
    private tasklistService: TaskListService,
  ) { }


  ngOnInit() {
    this.accountService.myAccount
      .pipe(filter(x => !!x))
      .subscribe(x => this.myUuid = x.uuid);
  }


  create() {
    const name = (this.newTaskListName || "").trim();
    this.newTaskListName = "";
    if (name.length === 0) {
      return;
    }

    this.tasklistService.add(<TaskList>{
      ownerUuid: this.myUuid,
      name: name,
    });
  }
}
