import { Component, OnInit } from "@angular/core";
import { ApiEventService } from "../services/api-event.service";

@Component({
  selector: "app-warning-modal-dialog",
  templateUrl: "./warning-modal-dialog.component.html",
  styleUrls: ["./warning-modal-dialog.component.scss"]
})
export class WarningModalDialogComponent implements OnInit {

  showDialog = false;
  lastError = undefined;
  constructor(
    private readonly apiEventService: ApiEventService,
  ) { }

  ngOnInit() {
    this.apiEventService.recentEvents.subscribe((reason) => {
      console.log("Received error");
      this.showDialog = true;
      this.lastError = reason;
    });
  }

  reload() {
    window.location.reload(true);
  }

}
