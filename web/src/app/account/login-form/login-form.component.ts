import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { SessionService } from "../../services/session.service";
import { StorageService } from "../../services/storage.service";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
  username: string;
  password: string;
  showError = false;

  @Output("success")
  success = new EventEmitter();

  working = false;

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    // tslint:disable-next-line:no-console
    this.success.subscribe((x) => console.debug(`LoginForm.succes emits ${x}`));
  }

  async login() {
    this.showError = false;
    try {
      this.working = true;
      const session = await this.sessionService.createSession(this.username, this.password);
      this.apiService.setSessionToken(session.token, session.expireAt);
      this.success.emit();
      this.working = false;
    } catch (reason) {
      console.error("Unable to create session", reason);
      this.showError = true;
      this.working = false;
    }
  }
}
