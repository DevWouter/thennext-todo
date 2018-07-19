import { Component, OnInit, ElementRef, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "task-page-divider",
  templateUrl: "./task-page-divider.component.html",
  styleUrls: ["./task-page-divider.component.scss"]
})
export class TaskPageDividerComponent implements OnInit {

  private isCapturing = false;

  @Output()
  rightWidth = new EventEmitter<number>();

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

      const exact = window.innerWidth - ev.clientX;
      this.rightWidth.emit(exact);
    });

    document.addEventListener("mouseup", (ev) => {
      if (!this.isCapturing) {
        // Not in capture mode.
        return;
      }

      const exact = window.innerWidth - ev.clientX;
      this.rightWidth.emit(exact);

      this.isCapturing = false;
    });
  }
}