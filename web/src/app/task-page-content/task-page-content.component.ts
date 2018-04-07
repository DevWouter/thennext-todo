import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-task-page-content",
  templateUrl: "./task-page-content.component.html",
  styleUrls: ["./task-page-content.component.scss"]
})
export class TaskPageContentComponent implements OnInit {
  size = 300;

  ngOnInit() {
  }

  offsetPaneWidth(offset: number): void {
    this.size += offset;
  }

  setPaneWidth(width: number): void {
    this.size = width;
  }
}
