import { Component, OnInit } from "@angular/core";
import { filter } from "rxjs/operators";

import { MessageBusService } from "../../services/message-bus";
import { Router } from "@angular/router";

@Component({
  selector: "app-warning-modal-dialog",
  templateUrl: "./warning-modal-dialog.component.html",
  styleUrls: ["./warning-modal-dialog.component.scss"]
})
export class WarningModalDialogComponent implements OnInit {
  showWarning = false;
  warningMessage = "";
  reconnectCounter = 0;
  constructor(
    private readonly messageBusService: MessageBusService,
    private readonly router: Router,
  ) {
  }

  ngOnInit() {
    this.messageBusService.status
      .pipe(filter(x => x.status === "closed"))
      .subscribe(x => {
        this.reconnectCounter++;
        this.warningMessage = `Trying to reconnect, attempt ${this.reconnectCounter}`;
        this.showWarning = true;
      });

    this.messageBusService.status
      .pipe(filter(x => x.status === "accepted"))
      .subscribe(x => {
        this.reconnectCounter = 0;
        this.showWarning = false;
      });

    this.messageBusService.status
      .pipe(filter(x => x.status === "rejected")).subscribe(() => {
        this.router.navigate(["/login"]);
      });
  }
}
