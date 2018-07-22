import { Component, OnInit, ElementRef, Output, EventEmitter, HostListener } from "@angular/core";

@Component({
  selector: "task-page-divider",
  templateUrl: "./task-page-divider.component.html",
  styleUrls: ["./task-page-divider.component.scss"]
})
export class TaskPageDividerComponent implements OnInit {

  private isCapturing = false;

  private _lastClientX: number = undefined;

  @Output()
  rightWidth = new EventEmitter<number>();

  @HostListener("window:resize")
  onResize() {
    if (this._lastClientX) {
      this.setPosition(this._lastClientX);
    }
  }

  constructor(private hostElement: ElementRef) {
  }

  ngOnInit() {
    const htmlElement = this.hostElement.nativeElement as HTMLElement;

    htmlElement.addEventListener("mousedown", (ev) => {
      this.isCapturing = true;
      ev.preventDefault();
    });

    document.addEventListener("mousemove", (ev) => {
      if (!this.isCapturing) {
        // Don't do anything.
        return;
      }

      this.setPosition(ev.clientX);
    });

    document.addEventListener("mouseup", (ev) => {
      if (!this.isCapturing) {
        // Not in capture mode.
        return;
      }

      this.setPosition(ev.clientX);
      this.isCapturing = false;
    });
  }

  setPosition(clientX: number) {
    this._lastClientX = clientX;

    if (window.innerWidth < (clientX + 300)) {
      clientX = window.innerWidth - 300;
    }

    const exact = window.innerWidth - clientX;

    this.rightWidth.emit(exact);
  }
}
