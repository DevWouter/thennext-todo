import { Component, OnInit } from "@angular/core";
import { AccountService, CreateRecoveryTokenResponse } from "../../services";

type PageState = "init" | "processing" | "ok" | "error-generic" | "error-unconfirmed" | "error-rejected";

@Component({
  selector: "app-forget-password-page",
  templateUrl: "./forget-password-page.component.html",
  styleUrls: ["./forget-password-page.component.scss"]
})
export class ForgetPasswordPageComponent implements OnInit {
  email = "";
  state: PageState = "init";

  constructor(private readonly accountService: AccountService) { }

  ngOnInit(): void { }

  async resetPassword() {
    try {
      this.state = "processing";
      const response = await this.accountService.requestRecoveryToken(this.email);
      this.handleResponse(response);
    } catch (err) {
      this.state = "error-generic";
      console.error("Unable to reset the password", err);
    }
  }

  private handleResponse(response: CreateRecoveryTokenResponse) {
    switch (response.state) {
      case "recovery-send":
        {
          this.state = "ok";
        }
        break;
      case "rejected":
        {
          this.state = "error-rejected";
        }
        break;
      case "unconfirmed":
        {
          this.state = "error-unconfirmed";
        }
        break;
      default: {
        throw new Error("Unknown server response:" + JSON.stringify(response));
      }
    }
  }
}
