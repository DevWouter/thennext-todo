import { Component, OnInit } from "@angular/core";
import { SessionService } from "../../services/session.service";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {
  username: string;
  password: string;
  response: any = null;

  constructor(
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
  }

  async login() {
    try {
      const session = await this.sessionService.createSession(this.username, this.password);
      this.response = session;
    } catch (reason) {
      this.response = reason;
    }
  }
}
