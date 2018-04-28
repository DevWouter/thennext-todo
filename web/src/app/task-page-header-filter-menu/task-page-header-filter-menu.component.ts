import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services";

@Component({
  selector: "app-task-page-header-filter-menu",
  templateUrl: "./task-page-header-filter-menu.component.html",
  styleUrls: ["./task-page-header-filter-menu.component.scss"]
})
export class TaskPageHeaderFilterMenuComponent implements OnInit {
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

  constructor(
    private readonly navigation: NavigationService,
  ) { }

  ngOnInit() {
    this.navigation.showCompleted.subscribe(x => { this._showCompleted = x; });
    this.navigation.showDelayed.subscribe(x => { this._showDelayed = x; });
    this.navigation.onlyPositive.subscribe(x => { this._onlyPositive = x; });
    this.navigation.onlyUnblocked.subscribe(x => { this._onlyUnblocked = x; });
  }

}
