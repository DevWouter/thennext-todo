import { Component, OnInit } from "@angular/core";
import { ContextService } from "../../services";

@Component({
  selector: "app-task-page",
  templateUrl: "./task-page.component.html",
  styleUrls: ["./task-page.component.scss"]
})
export class TaskPageComponent implements OnInit {
  size = 400;
  showPane = false;

  constructor(private readonly contextService: ContextService) { }

  ngOnInit() {
    this.contextService.activeTask
      .subscribe((task) => {
        this.showPane = !!task;
      });
  }

  offsetPaneWidth(offset: number): void {
    this.size += offset;
  }

  setPaneWidth(width: number): void {
    this.size = width;
  }

}
