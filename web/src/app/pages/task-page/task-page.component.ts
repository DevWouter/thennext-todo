import { Component, OnInit } from "@angular/core";
import { ContextService, MediaViewService } from "../../services";

// TODO: When screen becomes mobile, either show the active task or the tasklist
@Component({
  selector: "app-task-page",
  templateUrl: "./task-page.component.html",
  styleUrls: ["./task-page.component.scss"],
})
export class TaskPageComponent implements OnInit {
  size = 400;
  showPane = false;
  isMobile = false;
  constructor(
    private readonly contextService: ContextService,
    private readonly mediaViewService: MediaViewService,
  ) {
  }

  ngOnInit() {
    this.contextService.activeTask
      .subscribe((task) => {
        this.showPane = !!task;
      });

    this.mediaViewService.extraSmall.subscribe(x => this.isMobile = x);
  }

  offsetPaneWidth(offset: number): void {
    this.size += offset;
  }

  setPaneWidth(width: number): void {
    this.size = width;
  }

}
