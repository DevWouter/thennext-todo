import { Component, OnInit, ViewChild } from "@angular/core";
import { MessageBusStateService } from "../../services/message-bus";
import { Router } from '@angular/router';
import { SessionService, NavigationService } from '../../services';

@Component({
  selector: "app-settings-page",
  templateUrl: "./settings-page.component.html",
  styleUrls: ["./settings-page.component.scss"]
})
export class SettingsPageComponent implements OnInit {
  private _currentListUuid: string = undefined;
  public get currentListUuid(): string { return this._currentListUuid; }
  public set currentListUuid(v: string) { this._currentListUuid = v; this.updated(); }

  openSideNav = false;

  constructor(
    private readonly router: Router,
    private readonly navigation: NavigationService,
    private readonly sessionService: SessionService,
    private readonly messageBusStateService: MessageBusStateService,
  ) { }

  ngOnInit(): void {
    this.messageBusStateService.set("open");
  }

  close() {
    this.openSideNav = false;
  }

  open() {
    this.openSideNav = true;
  }

  goToTasks() {
    this.router.navigate(["/tasks"]);
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
