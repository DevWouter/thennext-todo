import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { Task } from "../../../models";

import {
  ContextService,
  TaskService,
  NavigationService,
  MediaViewService,
  MAX_MOBILE_WIDTH,
} from "../../../services";
import { filter, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "task-pane",
  templateUrl: "./task-pane.component.html",
  styleUrls: ["./task-pane.component.scss"]
})
export class TaskPaneComponent implements OnInit {
  @Input()
  set width(value: number) {
    this._originalWidth = this._width = +value;
  }


  _originalWidth: number = undefined;

  @HostBinding("style.width.px")
  private _width: number = undefined;

  task: Task = undefined;

  constructor(
    private readonly contextService: ContextService,
    private readonly taskService: TaskService,
    private readonly navigation: NavigationService,
    private readonly mediaViewService: MediaViewService,
  ) {
  }

  ngOnInit() {
    this.contextService.activeTask.subscribe(x => this.task = x);
    this.mediaViewService.extraSmall.pipe(
      distinctUntilChanged((x, y) => x === y),
    ).subscribe((isSmall) => {
      if (isSmall) {
        this._width = MAX_MOBILE_WIDTH;
      } else {
        this._width = this._originalWidth;
      }
    });
  }

  delete() {
    if (confirm(`Are you sure you want to delete "${this.task.title}"?`)) {
      this.taskService.delete(this.task);
      this.navigation.toTaskPage({ taskUuid: null });
    }
  }

  hide() {
    this.navigation.toTaskPage({ taskUuid: null });
  }


}
