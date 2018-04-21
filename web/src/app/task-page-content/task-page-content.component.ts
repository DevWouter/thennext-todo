import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";

@Component({
  selector: "app-task-page-content",
  templateUrl: "./task-page-content.component.html",
  styleUrls: ["./task-page-content.component.scss"]
})
export class TaskPageContentComponent implements OnInit {
  size = 400;
  showPane = false;

  constructor(
    private readonly contextService: ContextService,
  ) { }

  ngOnInit() {
    this.contextService.activeTaskView.subscribe(x => {
      this.showPane = !!x;
    });
  }

  offsetPaneWidth(offset: number): void {
    this.size += offset;
  }

  setPaneWidth(width: number): void {
    this.size = width;
  }
}
