import { Component, OnInit, Input, HostBinding, HostListener } from "@angular/core";

@Component({
  selector: "task-page-left",
  templateUrl: "./task-page-left.component.html",
  styleUrls: ["./task-page-left.component.scss"]
})
export class TaskPageLeftComponent implements OnInit {
  public showEmptyListMessage = false;
  public showTasks = true;
  public rightWidth = 0;

  @HostBinding("style.width.px")
  private _width: number = undefined;

  @Input()
  set width(value: number) {
    this.rightWidth = value;
    this.onResize();
  }

  constructor(
  ) {
  }

  ngOnInit() {
  }

  setFoundCount(tasksFound: number): void {
    this.showTasks = tasksFound > 0;
    this.showEmptyListMessage = tasksFound === 0;
  }

  @HostListener("window:resize")
  onResize() {
    this._width = window.innerWidth - (this.rightWidth + 6);
  }
}
