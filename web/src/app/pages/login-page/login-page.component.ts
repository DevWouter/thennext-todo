import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AccountService, SessionService, TokenService, StorageService, StorageKey } from "../../services";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent implements OnInit {
  username = "";
  password = "";
  working = false;
  showError = false;
  loginReason: string = undefined;

  constructor(
    private readonly router: Router,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly storageService: StorageService,
    private readonly activedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activedRoute.queryParams.subscribe(x => this.loginReason = x.reason);
  }

  async login() {
    try {
      this.loginReason = undefined; // Remove the login reason
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
