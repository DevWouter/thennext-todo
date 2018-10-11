import { Component, OnInit } from "@angular/core";
import { filter } from "rxjs/operators";

import {
  MessageService,
  ConnectionStateService,
} from "../../services";

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

  ngOnInit() {
    this.connectionStateService.state.subscribe(x => {
      if (x === "unload") {
        this.showWarning = true;
      } else {
        this.showWarning = false;
      }
    });

    this.messageService.$error.pipe(filter(x => x.requireLogin))
      .subscribe(x => {
        // HACK: We are reloading the page since we the repositories don't know if they should reload.
        window.location.assign("/login");
      });

    this.connectionStateService.state.pipe(
      filter(x => x === "unload")).subscribe(() => {
        this.warningMessage = `Trying to reconnect, attempt ${this.reconnectCounter++}`;
        console.log(this.warningMessage);
        this.messageService.reconnect();
      });
  }
}
