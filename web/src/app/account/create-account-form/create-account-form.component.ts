import { Component, OnInit } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { Observable } from "rxjs/Observable";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-create-account-form",
  templateUrl: "./create-account-form.component.html",
  styleUrls: ["./create-account-form.component.scss"]
})
export class CreateAccountFormComponent implements OnInit {
  username = "";
  password = "";
  response: any = null;

  constructor(
    private accountService: AccountService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
  }

  async submit() {
    this.response = await this.accountService.createAccount(this.username, this.password);
  }
}
