import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-task-page-header",
  templateUrl: "./task-page-header.component.html",
  styleUrls: ["./task-page-header.component.scss"]
})
export class TaskPageHeaderComponent implements OnInit {
  showFilterMenu = false;
  enableTaskLists = false; // Disabled for now
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
  }

  toSettings() {
    this.router.navigate(["/settings"]);
  }

}
