import { Component, OnInit, Input } from "@angular/core";
import { ContextService } from "../services/context.service";
import { ChecklistItem } from "../services/models/checklist-item.dto";
import { ChecklistItemService } from "../services/checklist-item.service";
import { Task } from "../services/models/task.dto";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: "app-task-page-content-pane-checklist",
  templateUrl: "./task-page-content-pane-checklist.component.html",
  styleUrls: ["./task-page-content-pane-checklist.component.scss"]
})
export class TaskPageContentPaneChecklistComponent implements OnInit {
  items: ChecklistItem[] = [];
  newValue = "";

  private _taskSubject = new BehaviorSubject<Task>(undefined);
  private _task: Task;
  @Input()
  public set task(v: Task) {
    this._task = v;
    this._taskSubject.next(v);
  }

  constructor(
    private checklistItemService: ChecklistItemService,
  ) { }

  ngOnInit() {
    this.checklistItemService.entries
      .combineLatest(this._taskSubject,
        (items, task) => items.filter(x => x.taskUuid === (task && task.uuid))
      )
      .subscribe(items => this.items = items);
  }

  create(event: Event) {
    const title = this.newValue.trim();
    if (title.length === 0) {
      this.newValue = "";
      event.preventDefault(); // Prevent return
      return;
    }

    this.checklistItemService.add(<ChecklistItem>{
      checked: false,
      title: title,
      taskUuid: this._task.uuid,
    });

    this.newValue = "";
    // Prevent the enter button from adding a line after keyup.
    event.preventDefault();
  }
}
