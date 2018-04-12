import { Component, OnInit, Input, HostBinding } from "@angular/core";

@Component({
  selector: "app-task-page-content-pane",
  templateUrl: "./task-page-content-pane.component.html",
  styleUrls: ["./task-page-content-pane.component.scss"]
})
export class TaskPageContentPaneComponent implements OnInit {
  @Input()
  set width(value: number) {
    console.log(`Recieved new width: ${value}`);
    this._width = +value;
  }

  @HostBinding("style.width.px")
  private _width: number = undefined;

  constructor() { }

  ngOnInit() {
  }

}
