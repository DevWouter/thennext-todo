import { Injectable } from "@angular/core";
import { MessageBusService } from "./message-bus.service";
import { filter } from "rxjs/operators";
import { BehaviorSubject, combineLatest } from "rxjs";

/**
 * Handles the connection state of the messagebus
 */
@Injectable()
export class MessageBusStateService {
  private desiredState: "open" | "close" = "close";
  private $desiredState = new BehaviorSubject<"open" | "close">(this.desiredState);

  constructor(private readonly messageBusService: MessageBusService) {
    this.setup();
  }

  private setup() {
    // Open the connection if:
    // - The connection is "closed"
    //   And we desire it to be "open"
    combineLatest(this.messageBusService.status, this.$desiredState)
      .pipe(filter(([x, y]) => x.status === "closed" && y === "open"))
      .subscribe(() => this.messageBusService.connect());


    // Close the connection if:
    // - The connection is "open" or "accepted"
    //   And we desire it to be "closed"
    combineLatest(this.messageBusService.status, this.$desiredState)
      .pipe(filter(([x, y]) => (x.status === "connected" || x.status === "accepted") && y === "close"))
      .subscribe(() => this.messageBusService.disconnect());

    // Force the desiredState to "close" if
    // - The connection was "rejected"
    this.messageBusService.status
      .pipe(filter(x => x.status === "rejected"))
      .subscribe(() => this.set("close"));
  }

  set(state: "open" | "close") {
    if (state === this.desiredState) {
      return;
    }

    this.desiredState = state;
    this.$desiredState.next(this.desiredState);
  }

}
