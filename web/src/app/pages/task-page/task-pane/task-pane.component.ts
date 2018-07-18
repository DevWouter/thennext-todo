import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { Task } from "../../../models";

import {
  ContextService,
  TaskService,
  NavigationService
} from "../../../services";

@Component({
  selector: "task-pane",
  templateUrl: "./task-pane.component.html",
  styleUrls: ["./task-pane.component.scss"]
})
export class TaskPaneComponent implements OnInit {
  @Input()
  set width(value: number) { this._width = +value; }

  @HostBinding("style.width.px")
  private _width: number = undefined;

  task: Task = undefined;

  constructor(
    private readonly contextService: ContextService,
    private readonly taskService: TaskService,
    private readonly navigation: NavigationService,
  ) {
  }

  ngOnInit() {
    this.contextService.activeTask.subscribe(x => this.task = x);
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
