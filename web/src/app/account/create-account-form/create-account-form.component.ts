import { Output, Component, OnInit, EventEmitter } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { Observable } from "rxjs/Observable";
import { SessionService } from "../../services/session.service";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-create-account-form",
  templateUrl: "./create-account-form.component.html",
  styleUrls: ["./create-account-form.component.scss"]
})
export class CreateAccountFormComponent implements OnInit {
  username = "";
  password = "";
  @Output("success")
  success = new EventEmitter<boolean>();

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
  }

  async submit() {
    const account = await this.accountService.createAccount(this.username, this.password);
    if (account) {
      console.log(`Account was create for ${account}`);
      try {
        const session = await this.sessionService.createSession(this.username, this.password);
        this.apiService.setSessionToken(session.token, session.expireAt);
        this.success.emit(true);
      } catch (reason) {
        console.error("Unable to create session", reason);
        this.success.emit(false);
      }
    }
  }
}
