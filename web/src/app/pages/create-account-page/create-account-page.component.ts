import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AccountService } from "../../services";

@Component({
  selector: "app-create-account-page",
  templateUrl: "./create-account-page.component.html",
  styleUrls: ["./create-account-page.component.scss"]
})
export class CreateAccountPageComponent implements OnInit {
  username = "";
  password = "";
  working = false;
  constructor(
    private router: Router,
    private accountService: AccountService,
  ) { }

  ngOnInit() {
  }

  async submit() {
    this.working = true;
    const account = await this.accountService.createAccount(this.username, this.password);
    if (account) {
      this.router.navigate(["/account-created"]);
    }else {
      this.working = false;
    }
  }

}
