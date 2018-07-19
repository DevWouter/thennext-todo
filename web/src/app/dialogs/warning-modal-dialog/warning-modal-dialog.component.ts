import { Component, OnInit } from "@angular/core";
import { filter } from "rxjs/operators";

import {
  StorageService,
  ApiEventService,
  MessageService,
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

  private _showDialog = false;
  private _autoReloadCheck = false;

  public get showDialog(): boolean { return this._showDialog; }
  public set showDialog(v: boolean) { this._showDialog = v; this.checkAutoReload(); }

  public get autoReloadCheck(): boolean { return this._autoReloadCheck; }
  public set autoReloadCheck(v: boolean) {
    this._autoReloadCheck = v;
    this.storageService.set("AUTO_RELOAD_ON_ERROR", JSON.stringify(v));
    if (v) { this.checkAutoReload(); }
  }


  lastError = undefined;
  private container = new ErrorEventContainer();
  constructor(
    private readonly apiEventService: ApiEventService,
    private readonly storageService: StorageService,
    private readonly messageService: MessageService,
  ) { }

  ngOnInit() {
    const storage_string = this.storageService.get("ERROR_STATUS") || null;
    this.container = (JSON.parse(storage_string) || new ErrorEventContainer()) as ErrorEventContainer;
    this._autoReloadCheck = JSON.parse(this.storageService.get("AUTO_RELOAD_ON_ERROR") || "false");

    // Remove all events that occured more then 5 seconds ago.
    this.container.events = this.container.events.filter(x => x.date > (Date.now() - 5000));
    this.storageService.set("ERROR_STATUS", JSON.stringify(this.container));

    this.apiEventService.recentEvents.subscribe((reason) => {
      // Store a new error event
      this.container.events.push(new ErrorEvent());
      this.showDialog = true;
      this.lastError = reason;
    });

    this.messageService.status
      .pipe(filter(x => x === "down"))
      .subscribe(() => {
        this.container.events.push(new ErrorEvent());
        this.showDialog = true;
        this.lastError = "Connection was closed";
      });
  }

  checkAutoReload() {
    this.container.events = this.container.events.filter(x => x.date > (Date.now() - 5000));
    this.storageService.set("ERROR_STATUS", JSON.stringify(this.container));

    if (!this.autoReloadCheck) { return; }
    if (this.container.events.length >= 5) {
      this.autoReloadCheck = false; // Disbale auto reload now that we have more than 5 errors.
      return;
    }

    // Save the error status
    this.reload();
  }

  reload() {
    window.location.reload(true);
  }

}