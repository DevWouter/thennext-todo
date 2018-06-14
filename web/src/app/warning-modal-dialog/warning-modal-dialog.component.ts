import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-warning-modal-dialog",
  templateUrl: "./warning-modal-dialog.component.html",
  styleUrls: ["./warning-modal-dialog.component.scss"]
})
export class WarningModalDialogComponent implements OnInit {

  showDialog = false;
  constructor() { }

  ngOnInit() {
  }

}
