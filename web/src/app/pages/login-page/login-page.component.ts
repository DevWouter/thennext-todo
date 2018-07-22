import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AccountService, SessionService, TokenService, StorageService, StorageKey } from "../../services";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent implements OnInit {
  username: string = "";
  password: string = "";
  working: boolean = false;
  showError: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly storageService: StorageService,
  ) { }

  ngOnInit() {
  }

  async login() {
    try {
      this.username = (this.username || "").trim();
      this.password = (this.password || "").trim();
      this.working = true;
      const loginResult = await this.sessionService.createSession(this.username, this.password);
      this.storageService.set(StorageKey.SESSION_TOKEN, loginResult.token);
      this.tokenService.set(loginResult.token);
      this.goToTaskPage();
    } catch (err) {
      console.error(err);
      this.showError = true;
      this.password = "";
    } finally {
      this.working = false;
    }
  }

  goToTaskPage() {
    this.router.navigate(["/tasks"]);
  }

}
