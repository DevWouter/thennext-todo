import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";
import { TaskPageNavigation } from "../services/models/task-page-navigation";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent implements OnInit {

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit() {
  }

  goToTaskPage() {
    this.router.navigate(["/tasks"]);
  }

}
