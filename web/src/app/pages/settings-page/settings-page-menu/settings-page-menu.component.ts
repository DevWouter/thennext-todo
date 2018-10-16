import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NavigationService,
  SessionService,
} from '../../../services';
import { MenuComponent } from '../../../gui/menu/menu.component';

@Component({
  selector: 'settings-page-menu',
  templateUrl: './settings-page-menu.component.html',
  styleUrls: ['./settings-page-menu.component.scss']
})
export class SettingsPageMenuComponent implements OnInit {
  private _currentListUuid: string = undefined;
  public get currentListUuid(): string { return this._currentListUuid; }
  public set currentListUuid(v: string) { this._currentListUuid = v; this.updated(); }

  @ViewChild(MenuComponent)
  private menu: MenuComponent;

  constructor(
    private readonly router: Router,
    private readonly navigation: NavigationService,
    private readonly sessionService: SessionService,
  ) { }

  ngOnInit() {
  }

  close() {
    this.menu.close();
  }

  open() {
    this.menu.open();
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
