import { Component, OnInit, Input } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Task } from "../services/models/task.dto";
import { TaskService } from "../services/task.service";

@Component({
  selector: "app-task-page-content-pane-title",
  templateUrl: "./task-page-content-pane-title.component.html",
  styleUrls: ["./task-page-content-pane-title.component.scss"],
})
export class TaskPageContentPaneTitleComponent implements OnInit {
  private _taskTitle: string;
  private _nextTaskTitle = new Subject<string>();

  @Input()
  set task(task: Task) {
    this._nextTaskTitle.complete();
    this._taskTitle = task.title;

    // Create a new subjec to follow.
    this._nextTaskTitle = new Subject<string>();
    this._nextTaskTitle.subscribe(t => task.title = t);
    this._nextTaskTitle
      .debounceTime(350)
      .subscribe(title => {
        task.title = this._taskTitle;
        this.taskService.update(task);
      });
  }

  public get taskTitle(): string {
    return this._taskTitle;
  }

  public set taskTitle(v: string) {
    this._taskTitle = v;
    this._nextTaskTitle.next(v);
  }

  constructor(
    private taskService: TaskService,
  ) { }

  ngOnInit() {
  }
}
