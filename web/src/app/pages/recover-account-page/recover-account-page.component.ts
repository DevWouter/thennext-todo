import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AccountService } from '../../services';

type PageStatus = "init" | "processing" | "done" | "rejected" | "error-generic";

@Component({
  selector: 'app-recover-account-page',
  templateUrl: './recover-account-page.component.html',
  styleUrls: ['./recover-account-page.component.scss']
})
export class RecoverAccountPageComponent implements OnInit {
  state: PageStatus = "init";
  email: string = "";
  password = "";
  token: string = undefined;
  errorMessage = "";
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(x => {
      this.token = x["token"];
    });
  }

  async recoverAccount() {
    try {
      this.state = "processing";
      const response = await this.accountService.resetPassword(this.token, this.email, this.password);
      switch (response.state) {
        case "accepted": {
          this.state = "done";
          setTimeout(() => {
            window.location.assign("/login");
          }, 5000);
        } break;
        case "rejected": {
          this.state = "rejected";
          this.errorMessage = response.message;
        } break;
        default: {
          throw new Error("No switch-case for " + response.state);
        }
      }
    } catch (err) {
      console.error("Error while trying to recover account", err);
      this.state = "error-generic";
    }
  }
}
