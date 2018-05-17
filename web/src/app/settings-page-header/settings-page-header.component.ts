import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";

@Component({
  selector: "app-settings-page-header",
  templateUrl: "./settings-page-header.component.html",
  styleUrls: ["./settings-page-header.component.scss"]
})
export class SettingsPageHeaderComponent implements OnInit {

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
