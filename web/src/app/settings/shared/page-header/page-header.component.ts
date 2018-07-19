import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../../../services/navigation.service";

@Component({
  selector: "settings-page-header",
  templateUrl: "./page-header.component.html",
  styleUrls: ["./page-header.component.scss"]
})
export class PageHeaderComponent implements OnInit {

  constructor(
    private navigation: NavigationService,
  ) { }

  ngOnInit() {
  }

  toTasks() {
    this.navigation.toTaskPage({
      taskListUuid: this.navigation.lastTaskListUuid
    });
  }
}
