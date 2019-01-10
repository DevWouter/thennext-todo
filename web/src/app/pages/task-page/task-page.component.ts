import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import {
  ContextService,
  MediaViewService,
  NavigationService,
  AccountService,
} from "../../services";
import { MessageBusStateService } from "../../services/message-bus";

// TODO: When screen becomes mobile, either show the active task or the tasklist
@Component({
  selector: "app-task-page",
  templateUrl: "./task-page.component.html",
  styleUrls: ["./task-page.component.scss"],
})
export class TaskPageComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();

  size = 400;
  isMobile = false;

  public displayName = "";
  public $displayName: Observable<string>;
  public $showPane: Observable<boolean>;
  public openSideNav = false;

  constructor(
    private readonly accountService: AccountService,
    private readonly contextService: ContextService,
    private readonly mediaViewService: MediaViewService,
    private readonly messageBusStateService: MessageBusStateService,
  ) {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
    this.$displayName = this.accountService.myAccount.pipe(
      filter(x => !!x),
      map(x => x.displayName || ""),
    );

    this.$showPane = this.contextService.activeTask
      .pipe(
        map((task) => !!task)
      );

    this.messageBusStateService.set("open");

    this.subscriptions.add(
      this.mediaViewService.extraSmall.subscribe(x => this.isMobile = x)
    );
  }

  close() { this.openSideNav = false; }
  open() { this.openSideNav = true; }

  offsetPaneWidth(offset: number): void { this.size += offset; }
  setPaneWidth(width: number): void { this.size = width; }

}
