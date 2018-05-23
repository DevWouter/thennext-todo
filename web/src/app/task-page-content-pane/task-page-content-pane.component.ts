import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { TaskService } from "../services/task.service";
import { ContextService } from "../services/context.service";
import { Task } from "../services/models/task.dto";
import { NavigationService } from "../services/navigation.service";

@Component({
  selector: "app-task-page-content-pane",
  templateUrl: "./task-page-content-pane.component.html",
  styleUrls: ["./task-page-content-pane.component.scss"]
})
export class TaskPageContentPaneComponent implements OnInit {
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
    if (confirm(`Are you sure you "${this.task.title}" want to delete?`)) {
      this.taskService.delete(this.task);
      this.navigation.toTaskPage({ taskUuid: null });
    }
  }

  hide() {
    this.navigation.toTaskPage({ taskUuid: null });
  }


}
