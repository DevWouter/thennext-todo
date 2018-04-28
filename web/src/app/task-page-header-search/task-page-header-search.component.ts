import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";

@Component({
  selector: "app-task-page-header-search",
  templateUrl: "./task-page-header-search.component.html",
  styleUrls: ["./task-page-header-search.component.scss"]
})
export class TaskPageHeaderSearchComponent implements OnInit {

  private _search: string = undefined;
  get search(): string { return this._search; }
  set search(v: string) { this._search = v; this.navigation.toTaskPage({ search: v }); }
  constructor(
    private readonly navigation: NavigationService,
  ) { }

  ngOnInit() {
    this.navigation.search.subscribe(x => this._search = x);
  }

}
