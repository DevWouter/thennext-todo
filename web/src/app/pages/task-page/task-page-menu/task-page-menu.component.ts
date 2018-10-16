import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { combineLatest, BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

import { NavigationService, SessionService, AccountService, ContextService, TaskListService } from "../../../services";
import { TaskList } from "../../../models";
import { MenuComponent } from "../../../gui/menu/menu.component";


@Component({
  selector: "app-task-page-menu",
  templateUrl: "./task-page-menu.component.html",
  styleUrls: ["./task-page-menu.component.scss"]
})
export class TaskPageMenuComponent implements OnInit {
  private _showCompleted: boolean;
  public get showCompleted(): boolean { return this._showCompleted; }
  public set showCompleted(v: boolean) { this.navigation.toTaskPage({ showCompleted: v }); }

  private _showBlocked: boolean;
  public get showBlocked(): boolean { return this._showBlocked; }
  public set showBlocked(v: boolean) { this.navigation.toTaskPage({ showBlocked: v }); }

  private _showNegative: boolean;
  public get showNegative(): boolean { return this._showNegative; }
  public set showNegative(v: boolean) { this.navigation.toTaskPage({ showNegative: v }); }

  public displayName = "";
  public listName = "";

  public connectionStatus = "";
  public lists: TaskList[] = [];

  private _currentListUuid: string = undefined;
  public get currentListUuid(): string { return this._currentListUuid; }
  public set currentListUuid(v: string) { this._currentListUuid = v; this.updated(); this.close(); }


  @ViewChild(MenuComponent)
  private menu: MenuComponent;

  constructor(
    private readonly router: Router,
    private readonly navigation: NavigationService,
    private readonly sessionService: SessionService,
    private readonly taskListService: TaskListService,
    private readonly accountService: AccountService,
    private readonly contextService: ContextService,
  ) { }

  ngOnInit() {
    this.contextService.activeTaskList
      .pipe(filter(x => !!x))
      .subscribe(x => this.listName = x.name);

    this.navigation.showCompleted.subscribe(x => { this._showCompleted = x; });
    this.navigation.showNegative.subscribe(x => { this._showNegative = x; });
    this.navigation.showBlocked.subscribe(x => { this._showBlocked = x; });
    this.accountService.myAccount.subscribe(x => {
      if (x) {
        this.displayName = x.displayName;
      } else {
        this.displayName = "";
      }
    }
    );

    combineLatest(this.taskListService.entries, this.navigation.taskListUuid)
      .subscribe(([taskList, currentUuid]) => {
        this.lists = taskList;
        this._currentListUuid = currentUuid;
        if (!this._currentListUuid) {
          const primaryTasklist = this.lists.find(x => x.primary);
          if (primaryTasklist) {
            this._currentListUuid = primaryTasklist.uuid;
          }
        }
      });
  }

  close() {
    this.menu.close();
  }

  open() {
    this.menu.open();
  }
  goToSettings() {
    this.router.navigate(["/settings"]);
  }

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      this.sessionService.logout();
      this.router.navigate(["/"]);
    }
  }

  updated() {
    this.navigation.toTaskPage({ taskListUuid: this._currentListUuid, taskUuid: null });
  }

}
