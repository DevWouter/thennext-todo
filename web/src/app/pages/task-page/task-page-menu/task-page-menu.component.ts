import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService, NavigationService } from '../../../services';
import { TaskList } from '../../../models';

@Component({
  selector: 'app-task-page-menu',
  templateUrl: './task-page-menu.component.html',
  styleUrls: ['./task-page-menu.component.scss']
})
export class TaskPageMenuComponent implements OnInit {
  private _currentListUuid: string;

  @Input() displayName: string;
  @Input() lists: TaskList[] = [];

  public get currentListUuid(): string { return this._currentListUuid; }
  @Input() public set currentListUuid(v: string) { this._currentListUuid = v; this.updated(); this.onClose(); }

  @Output() close = new EventEmitter<void>();

  private _showCompleted: boolean;
  public get showCompleted(): boolean { return this._showCompleted; }
  public set showCompleted(v: boolean) { this.navigation.toTaskPage({ showCompleted: v }); }

  private _showBlocked: boolean;
  public get showBlocked(): boolean { return this._showBlocked; }
  public set showBlocked(v: boolean) { this.navigation.toTaskPage({ showBlocked: v }); }

  private _showNegative: boolean;
  public get showNegative(): boolean { return this._showNegative; }
  public set showNegative(v: boolean) { this.navigation.toTaskPage({ showNegative: v }); }

  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly navigation: NavigationService,
  ) { }

  ngOnInit() {
    this.navigation.showCompleted.subscribe(x => { this._showCompleted = x; });
    this.navigation.showNegative.subscribe(x => { this._showNegative = x; });
    this.navigation.showBlocked.subscribe(x => { this._showBlocked = x; });
  }

  onClose() {
    this.close.emit();
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
