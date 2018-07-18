import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "task-pane-region",
  templateUrl: "./task-pane-region.component.html",
  styleUrls: ["./task-pane-region.component.scss"]
})
export class TaskPaneRegionComponent implements OnInit {
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
