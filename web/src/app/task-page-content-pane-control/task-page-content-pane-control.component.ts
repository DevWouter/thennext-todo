import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-task-page-content-pane-control",
  templateUrl: "./task-page-content-pane-control.component.html",
  styleUrls: ["./task-page-content-pane-control.component.scss"]
})
export class TaskPageContentPaneControlComponent implements OnInit {
  private _header: string;

  @Input()
  public set header(v: string) {
    this._header = v;
  }

  public get header(): string {
    return this._header;
  }

  constructor() { }

  ngOnInit() {
  }

}
