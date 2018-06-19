import { Component, OnInit } from "@angular/core";
import { TaskList } from "../../services/models/task-list.dto";
import { TaskListService } from "../../services/task-list.service";
import { AccountService } from "../../services/account.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-settings-page-tasklist-creator",
  templateUrl: "./settings-page-tasklist-creator.component.html",
  styleUrls: ["./settings-page-tasklist-creator.component.scss"]
})
export class SettingsPageTasklistCreatorComponent implements OnInit {
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
