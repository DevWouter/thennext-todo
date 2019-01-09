import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService, SessionService } from '../../../services';

@Component({
  selector: 'app-settings-page-menu',
  templateUrl: './settings-page-menu.component.html',
  styleUrls: ['./settings-page-menu.component.scss']
})
export class SettingsPageMenuComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  private _currentListUuid: string = undefined;
  public get currentListUuid(): string { return this._currentListUuid; }
  public set currentListUuid(v: string) { this._currentListUuid = v; this.updated(); }

  constructor(
    private readonly router: Router,
    private readonly navigation: NavigationService,
    private readonly sessionService: SessionService,
  ) { }

  ngOnInit(): void {
  }

  onClose() {
    this.close.emit();
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
