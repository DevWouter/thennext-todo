import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";
import { Router } from "@angular/router";
import { SessionService } from "../services/session.service";

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

  expand = false;
  constructor(
    private readonly navigation: NavigationService,
    private readonly router: Router,
    private readonly sessionService: SessionService,
  ) { }

  ngOnInit() {
    this.navigation.showCompleted.subscribe(x => { this._showCompleted = x; });
    this.navigation.showDelayed.subscribe(x => { this._showDelayed = x; });
    this.navigation.onlyPositive.subscribe(x => { this._onlyPositive = x; });
    this.navigation.onlyUnblocked.subscribe(x => { this._onlyUnblocked = x; });
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
