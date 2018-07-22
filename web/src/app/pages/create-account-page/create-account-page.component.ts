import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AccountService, SessionService, TokenService } from "../../services";

@Component({
  selector: "app-create-account-page",
  templateUrl: "./create-account-page.component.html",
  styleUrls: ["./create-account-page.component.scss"]
})
export class CreateAccountPageComponent implements OnInit {
  username = "";
  password = "";
  constructor(
    private router: Router,
    private accountService: AccountService,
    private sessionService: SessionService,
    private tokenService: TokenService,
  ) { }

  ngOnInit() {
  }

  async submit() {
    const account = await this.accountService.createAccount(this.username, this.password);
    if (account) {
      console.log(`Account was create for ${account}`);
      try {
        const session = await this.sessionService.createSession(this.username, this.password);
        this.tokenService.set(session.token);
        this.router.navigate(["/tasks"]);
      } catch (reason) {
        console.error("Unable to create session", reason);
      }
    }
  }

}
