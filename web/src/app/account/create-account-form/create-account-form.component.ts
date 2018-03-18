import { Component, OnInit } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-create-account-form",
  templateUrl: "./create-account-form.component.html",
  styleUrls: ["./create-account-form.component.scss"]
})
export class CreateAccountFormComponent implements OnInit {
  username = "";
  password = "";
  response: any = undefined;
  accounts: Observable<any>;
  clickCounter = 0;

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accounts = this.accountService.getAccounts();
  }

  async submit() {
    this.response = await this.accountService.createAccount(this.username, this.password);
    this.clickCounter++;
  }

  getAccounts() {

  }
}
