import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import {
  ApiService,
  SessionService,
  StorageService,
  StorageKey,
} from "../../services";

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
  success = new EventEmitter<boolean>();

  constructor(
    private apiService: ApiService,
    private sessionService: SessionService,
    private storageService: StorageService,
  ) { }

  ngOnInit() {
    // tslint:disable-next-line:no-console
    this.success.subscribe((x) => console.debug(`LoginForm.succes emits ${x}`));
  }

  async extend() {
    try {
      const response = await this.sessionService.extendSession();
      this.apiService.setSessionToken(response.token, response.expireAt);
      console.log("Extended");
    } catch (reason) {
      console.log(reason);
    }
  }

  async login() {
    this.showError = false;
    try {
      const session = await this.sessionService.createSession(this.username, this.password);
      this.apiService.setSessionToken(session.token, session.expireAt);
      this.success.emit(true);
    } catch (reason) {
      console.error("Unable to create session", reason);
      this.showError = true;
      this.success.emit(false);
    }
  }
}
