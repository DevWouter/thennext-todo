import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { NavigationService, SessionService, AccountService, ContextService } from "../services";


@Component({
  selector: "app-topnav",
  templateUrl: "./topnav.component.html",
  styleUrls: ["./topnav.component.scss"]
})
export class TopnavComponent implements OnInit {
  private _showCompleted: boolean;
  public get showCompleted(): boolean { return this._showCompleted; }
  public set showCompleted(v: boolean) { this.navigation.toTaskPage({ showCompleted: v }); }

  private _showDelayed: boolean;
  public get showDelayed(): boolean { return this._showDelayed; }
  public set showDelayed(v: boolean) { this.navigation.toTaskPage({ showDelayed: v }); }

  private _onlyUnblocked: boolean;
  public get onlyUnblocked(): boolean { return this._onlyUnblocked; }
  public set onlyUnblocked(v: boolean) { this.navigation.toTaskPage({ onlyUnblocked: v }); }

  private _onlyPositive: boolean;
  public get onlyPositive(): boolean { return this._onlyPositive; }
  public set onlyPositive(v: boolean) { this.navigation.toTaskPage({ onlyPositive: v }); }

  public displayName = "";
  public listName = "";

  public connectionStatus = "";

  expand = false;
  constructor(
    private readonly router: Router,
    private readonly navigation: NavigationService,
    private readonly sessionService: SessionService,
    private readonly accountService: AccountService,
    private readonly contextService: ContextService,
  ) { }

  ngOnInit() {
    this.contextService.activeTaskList
      .pipe(filter(x => !!x))
      .subscribe(x => this.listName = x.name);

    this.navigation.showCompleted.subscribe(x => { this._showCompleted = x; });
    this.navigation.showDelayed.subscribe(x => { this._showDelayed = x; });
    this.navigation.onlyPositive.subscribe(x => { this._onlyPositive = x; });
    this.navigation.onlyUnblocked.subscribe(x => { this._onlyUnblocked = x; });
    this.accountService.myAccount.subscribe(x => {
      if (x) {
        this.displayName = x.displayName;
      } else {
        this.displayName = "";
      }
    }
    );
  }

  close() {
    this.expand = false;
  }

  toggle() {
    this.expand = !this.expand;
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
