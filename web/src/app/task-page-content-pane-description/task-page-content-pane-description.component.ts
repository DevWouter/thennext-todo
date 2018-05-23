import { Component, OnInit, Input } from "@angular/core";
import { ContextService } from "../services/context.service";
import { TaskService } from "../services/task.service";
import { Task } from "../services/models/task.dto";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-task-page-content-pane-description",
  templateUrl: "./task-page-content-pane-description.component.html",
  styleUrls: ["./task-page-content-pane-description.component.scss"]
})
export class TaskPageContentPaneDescriptionComponent implements OnInit {
  private _value: string;
  private _nextValue = new Subject<string>();

  public get value(): string { return this._value; }
  public set value(v: string) { this._value = v; this._nextValue.next(v); }

  @Input()
  public set task(task: Task) {
    this._value = task.description;
    this._nextValue.complete();

    this._nextValue = new Subject<string>();
    this._nextValue.subscribe(v => task.description = v);
    this._nextValue
      .pipe(debounceTime(350))
      .subscribe(v => {
        task.description = v;
        this.taskService.update(task);
      });
  }

  constructor(
    private taskService: TaskService,
  ) {
  }

  ngOnInit() {
  }
}
