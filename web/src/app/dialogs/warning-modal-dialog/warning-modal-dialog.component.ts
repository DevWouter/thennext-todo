import { Component, OnInit } from "@angular/core";
import { filter, tap } from "rxjs/operators";

import {
  MessageService,
  ConnectionStateService,
} from "../../services";

class ErrorEvent {
  // Milliseconds
  date: number = Date.now();
}

class ErrorEventContainer {
  events: ErrorEvent[] = [];
}

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
    private readonly messageService: MessageService,
    private connectionStateService: ConnectionStateService,
  ) {
  }

  sendBadMessage() {
    this.messageService.send("set-token", { token: "fake" });
  }

  ngOnInit() {
    this.connectionStateService.state.subscribe(x => {
      if (x === "unload") {
        this.showWarning = true;
      } else {
        this.showWarning = false;
      }
    });

    this.connectionStateService.state.pipe(
      tap(x => console.log("Connection status", x)),
      filter(x => x === "unload")).subscribe(() => {
        this.warningMessage = `Trying to reconnect, attempt ${this.reconnectCounter++}`;
        console.log(this.warningMessage);
        this.messageService.reconnect();
      });
  }
}
