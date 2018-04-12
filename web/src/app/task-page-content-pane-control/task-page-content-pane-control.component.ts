import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-task-page-content-pane-control",
  templateUrl: "./task-page-content-pane-control.component.html",
  styleUrls: ["./task-page-content-pane-control.component.scss"]
})
export class TaskPageContentPaneControlComponent implements OnInit {
  private _title: string;

  @Input()
  public set title(v: string) {
    this._title = v;
  }

  public get title(): string {
    return this._title;
  }

  constructor() { }

  ngOnInit() {
  }

}
