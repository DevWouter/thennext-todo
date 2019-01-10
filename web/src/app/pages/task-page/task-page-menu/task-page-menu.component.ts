import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService, NavigationService } from '../../../services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-page-menu',
  templateUrl: './task-page-menu.component.html',
  styleUrls: ['./task-page-menu.component.scss']
})
export class TaskPageMenuComponent implements OnInit, OnDestroy {
  private readonly subs = new Subscription();

  @Input() displayName: string;
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.subs.add(this.navigation.showCompleted.subscribe(x => { this._showCompleted = x; }));
    this.subs.add(this.navigation.showNegative.subscribe(x => { this._showNegative = x; }));
    this.subs.add(this.navigation.showBlocked.subscribe(x => { this._showBlocked = x; }));
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
}
