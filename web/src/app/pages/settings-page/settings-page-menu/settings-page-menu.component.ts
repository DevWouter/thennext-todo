import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NavigationService,
  SessionService,
} from '../../../services';

@Component({
  selector: 'settings-page-menu',
  templateUrl: './settings-page-menu.component.html',
  styleUrls: ['./settings-page-menu.component.scss']
})
export class SettingsPageMenuComponent implements OnInit {
  private _currentListUuid: string = undefined;
  public get currentListUuid(): string { return this._currentListUuid; }
  public set currentListUuid(v: string) { this._currentListUuid = v; this.updated(); }


  expand = false;
  constructor(
    private readonly router: Router,
    private readonly navigation: NavigationService,
    private readonly sessionService: SessionService,
  ) { }

  ngOnInit() {
  }

  close() {
    this.expand = false;
  }

  toggle() {
    this.expand = !this.expand;
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
