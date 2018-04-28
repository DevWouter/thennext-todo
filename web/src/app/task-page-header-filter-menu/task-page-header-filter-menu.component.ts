import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services";

@Component({
  selector: "app-task-page-header-filter-menu",
  templateUrl: "./task-page-header-filter-menu.component.html",
  styleUrls: ["./task-page-header-filter-menu.component.scss"]
})
export class TaskPageHeaderFilterMenuComponent implements OnInit {
  private _showCompleted: boolean;
  public get showCompleted(): boolean {
    return this._showCompleted;
  }
  public set showCompleted(v: boolean) {
    this._showCompleted = v;
    this.navigation.toTaskPage({ showCompleted: v });
  }


  constructor(
    private readonly navigation: NavigationService,
  ) { }

  ngOnInit() {
    this.navigation.showCompleted.subscribe(x => { this._showCompleted = x; });
  }

}
