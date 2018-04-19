import { Component, OnInit } from "@angular/core";
import { TaskListService } from "../services/task-list.service";
import { TaskList } from "../services/models/task-list.dto";
import { NavigationService } from "../services";


@Component({
  selector: "app-task-page-header-tasklist-selector",
  templateUrl: "./task-page-header-tasklist-selector.component.html",
  styleUrls: ["./task-page-header-tasklist-selector.component.scss"]
})
export class TaskPageHeaderTasklistSelectorComponent implements OnInit {
  public lists: TaskList[] = [];

  private _currentListUuid: string = undefined;
  public get currentListUuid(): string { return this._currentListUuid; }
  public set currentListUuid(v: string) { this._currentListUuid = v; this.updated(); }

  constructor(
    private taskListService: TaskListService,
    private navigation: NavigationService,
  ) { }

  ngOnInit() {
    this.taskListService.entries.combineLatest(
      this.navigation.taskListUuid, (taskList, currentUuid) => {
        this.lists = taskList;
        this._currentListUuid = currentUuid;
        if (!this._currentListUuid) {
          const primaryTasklist = this.lists.find(x => x.primary);
          if (primaryTasklist) {
            this._currentListUuid = primaryTasklist.uuid;
          }
        }
      }
    ).subscribe();
  }

  updated() {
    this.navigation.toTaskPage({ taskListUuid: this._currentListUuid });
  }
}