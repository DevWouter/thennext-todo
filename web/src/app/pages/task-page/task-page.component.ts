import { Component, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ContextService, MediaViewService } from "../../services";
import { MessageBusStateService } from "../../services/message-bus";

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
  $taskListName: Observable<string>;
  constructor(
    private readonly contextService: ContextService,
    private readonly mediaViewService: MediaViewService,
    private readonly messageBusStateService: MessageBusStateService,
  ) {
  }

  ngOnInit() {
    this.contextService.activeTask
      .subscribe((task) => {
        this.showPane = !!task;
      });

    this.$taskListName = this.contextService.activeTaskList.pipe(
      filter(x => !!x),
      map(x => x.name)
    );

    this.messageBusStateService.set("open");

    this.mediaViewService.extraSmall.subscribe(x => this.isMobile = x);
  }

  open() {

  }

  offsetPaneWidth(offset: number): void {
    this.size += offset;
  }

  setPaneWidth(width: number): void {
    this.size = width;
  }

}
