import { Component, OnInit, Input, HostBinding } from "@angular/core";

@Component({
  selector: "task-page-left",
  templateUrl: "./task-page-left.component.html",
  styleUrls: ["./task-page-left.component.scss"]
})
export class TaskPageLeftComponent implements OnInit {
  public showEmptyListMessage = false;
  public showTasks = true;

  @Input()
  set width(value: number) {
    this._width = window.innerWidth - (value + 6);
  }

  @HostBinding("style.width.px")
  private _width: number = undefined;

  constructor(
  ) {
  }

  ngOnInit() {
  }

  setFoundCount(tasksFound: number): void {
    this.showTasks = tasksFound > 0;
    this.showEmptyListMessage = tasksFound === 0;
  }
}
