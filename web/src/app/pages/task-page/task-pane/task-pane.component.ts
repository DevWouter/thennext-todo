import { Component, OnInit, Input, HostBinding } from "@angular/core";

import { distinctUntilChanged } from "rxjs/operators";

import { Task } from "../../../models";

import {
  ContextService,
  MediaViewService,
  MAX_MOBILE_WIDTH,
} from "../../../services";

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
  actionsAtTop = false;

  constructor(
    private readonly contextService: ContextService,
    private readonly mediaViewService: MediaViewService,
  ) {
  }

  ngOnInit() {
    this.contextService.activeTask.subscribe(x => this.task = x);
    this.mediaViewService.extraSmall.pipe(
      distinctUntilChanged((x, y) => x === y),
    ).subscribe((isSmall) => {
      if (isSmall) {
        this.actionsAtTop = true;
        this._width = MAX_MOBILE_WIDTH;
      } else {
        this.actionsAtTop = false;
        this._width = this._originalWidth;
      }
    });
  }



}
