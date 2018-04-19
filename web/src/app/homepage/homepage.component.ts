import { Component, OnInit } from "@angular/core";
import { NavigationService, TaskPageNavigation } from "../services";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {

  constructor(
    private navigationService: NavigationService,
  ) { }

  ngOnInit() {
  }

  goToTaskPage() {
    this.navigationService.toTaskPage(<TaskPageNavigation>{});
  }
}
