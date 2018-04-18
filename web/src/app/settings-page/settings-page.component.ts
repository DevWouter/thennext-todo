import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services";

@Component({
  selector: "app-settings-page",
  templateUrl: "./settings-page.component.html",
  styleUrls: ["./settings-page.component.scss"]
})
export class SettingsPageComponent implements OnInit {

  constructor(
    private navigation: NavigationService
  ) { }

  ngOnInit() {
  }

  toTaskList() {
    this.navigation.toTaskPage({});
  }
}
