import { Component, OnInit, ElementRef, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: "app-task-page-content-divider",
  templateUrl: "./task-page-content-divider.component.html",
  styleUrls: ["./task-page-content-divider.component.scss"]
})
export class TaskPageContentDividerComponent implements OnInit {

  private isCapturing = false;
  private prevPosition = 0;
  private startPosition = 0;

  @Output()
  deltaMove = new EventEmitter<number>();

  constructor(private hostElement: ElementRef) {
  }

  ngOnInit() {
    const htmlElement = this.hostElement.nativeElement as HTMLElement;

    htmlElement.addEventListener("mousedown", (ev) => {
      this.isCapturing = true;
      this.startPosition = ev.clientX;
      this.prevPosition = ev.clientX;
      ev.preventDefault();
    });

    document.addEventListener("mousemove", (ev) => {
      if (!this.isCapturing) {
        // Don't do anything.
        return;
      }

      const delta = ev.clientX - this.prevPosition;

      // Only report delta if useful.
      if (delta !== 0) {
        this.deltaMove.emit(delta);
      }

      // Store the new position.
      this.prevPosition = ev.clientX;
    });
    document.addEventListener("mouseup", (ev) => {
      if (!this.isCapturing) {
        // Not in capture mode.
        return;
      }

      const delta = ev.clientX - this.prevPosition;

      // Only report delta if useful.
      if (delta !== 0) {
        this.deltaMove.emit(delta);
      }

      // Store the new position.
      this.prevPosition = ev.clientX;
      this.isCapturing = false;
    });
  }

}
