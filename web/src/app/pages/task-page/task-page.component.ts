import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable, combineLatest } from 'rxjs';
import { map, filter, share } from 'rxjs/operators';

import { ContextService, MediaViewService, NavigationService, AccountService, TaskListService, SessionService } from "../../services";
import { MessageBusStateService } from "../../services/message-bus";
import { TaskList } from '../../models';
import { MenuComponent } from '../../gui/menu';
import { Router } from '@angular/router';

// TODO: When screen becomes mobile, either show the active task or the tasklist
@Component({
  selector: "app-task-page",
  templateUrl: "./task-page.component.html",
  styleUrls: ["./task-page.component.scss"],
})
export class TaskPageComponent implements OnInit {
  size = 400;
  showPane = false;
  isMobile = false;
  $taskListName: Observable<string>;
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

  public lists: TaskList[] = [];

  @ViewChild(MenuComponent)
  private menu: MenuComponent;

  private _currentListUuid: string = undefined;
  public get currentListUuid(): string { return this._currentListUuid; }
  public set currentListUuid(v: string) { this._currentListUuid = v; this.updated(); this.close(); }
  constructor(
    private readonly router: Router,
    private readonly accountService: AccountService,
    private readonly taskListService: TaskListService,
    private readonly sessionService: SessionService,
    private readonly navigation: NavigationService,
    private readonly contextService: ContextService,
    private readonly mediaViewService: MediaViewService,
    private readonly messageBusStateService: MessageBusStateService,
  ) {
  }

  ngOnInit() {
    this.contextService.activeTask
      .subscribe((task) => {
        this.showPane = !!task;
      });

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

    // Find current
    const $currentTaskList = combineLatest(this.taskListService.entries, this.navigation.taskListUuid)
      .pipe(
        map(([lists, uuid]) => {
          const primaryTasklist = lists.find(x => x.primary);
          const activeTasklist = lists.find(x => x.uuid === uuid);
          return activeTasklist || primaryTasklist;
        }),
        share(),
        filter(x => !!x),
      );

    this.$taskListName = $currentTaskList.pipe(
      map(x => x.name)
    );

    this.$taskListName = this.contextService.activeTaskList.pipe(
      filter(x => !!x),
      map(x => x.name)
    );

    this.messageBusStateService.set("open");

    this.mediaViewService.extraSmall.subscribe(x => this.isMobile = x);
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

  offsetPaneWidth(offset: number): void {
    this.size += offset;
  }

  setPaneWidth(width: number): void {
    this.size = width;
  }

}
