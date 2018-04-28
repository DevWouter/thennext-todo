import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";
import { TaskPageNavigation } from "../services/models/task-page-navigation";

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
