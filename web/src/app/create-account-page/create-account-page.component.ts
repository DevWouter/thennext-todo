import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NavigationService } from "../services/navigation.service";

@Component({
  selector: "app-create-account-page",
  templateUrl: "./create-account-page.component.html",
  styleUrls: ["./create-account-page.component.scss"]
})
export class CreateAccountPageComponent implements OnInit {

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit() {
  }

  goToTasksPage() {
    this.router.navigate(["/tasks"]);
  }
}
