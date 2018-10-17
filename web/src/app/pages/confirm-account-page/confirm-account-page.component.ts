import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { filter, delay } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import {
  SessionService,
} from "../../services";

enum Status {
  /** Waiting for input or checking with the API */
  Checking,
  /** The API has returned and confirmed that the account is now validated. */
  Confirmed,
  /** The API has returned with the message that the account was already confirmed. */
  AlreadyConfirmed,
  /** The API has returned with a negative response. The token is no longer valid or doesn't exist. */
  RejectedInvalid,
  /** An error has occured while checking */
  Error,
}

@Component({
  selector: "app-confirm-account-page",
  templateUrl: "./confirm-account-page.component.html",
  styleUrls: ["./confirm-account-page.component.scss"]
})
export class ConfirmAccountPageComponent implements OnInit {
  $token = new BehaviorSubject<string>(undefined);
  $status = new BehaviorSubject<Status>(Status.Checking);
  status = Status.Checking;
  constructor(
    private readonly router: Router,
    private readonly activedRoute: ActivatedRoute,
    private readonly sessionService: SessionService,
  ) { }

  ngOnInit() {
    const $token_exists = this.$token.pipe(filter(x => !!x));
    $token_exists.subscribe(async (token) => {
      try {
        const result = await this.sessionService.confirm(token);
        switch (result) {
          case "already-confirmed": { this.$status.next(Status.AlreadyConfirmed); } break;
          case "confirmed": { this.$status.next(Status.Confirmed); } break;
          case "rejected": { this.$status.next(Status.RejectedInvalid); } break;
        }
      } catch (reason) {
        console.error(reason);
        this.$status.next(Status.Error);
      }
    });

    this.$status.subscribe(x => this.status = x);
    this.$status.pipe(
      filter(x => x === Status.AlreadyConfirmed || x === Status.Confirmed),
      delay(3000),
    ).subscribe(() => {
      this.goToLoginPage();
    });

    this.activedRoute.queryParams.subscribe(x => this.$token.next(x.token));
  }

  goToLoginPage() {
    this.router.navigate(["/login"]);
  }

}
