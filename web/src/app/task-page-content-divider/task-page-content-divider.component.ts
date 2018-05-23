import { Component, OnInit, ElementRef, Output, EventEmitter } from "@angular/core";
import { Observable ,  BehaviorSubject } from "rxjs";

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
  rightWidth = new EventEmitter<number>();

  constructor(private hostElement: ElementRef) {
  }

  ngOnInit() {
    const htmlElement = this.hostElement.nativeElement as HTMLElement;

    htmlElement.addEventListener("mousedown", (ev) => {
      this.isCapturing = true;
      this.startPosition = ev.clientX;
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
