import { Component, OnInit, Input } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { ChecklistItem, Task } from "../../models";
import { ChecklistItemService, TaskService } from "../../services";


@Component({
  selector: "task-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.scss"]
})
export class ChecklistComponent implements OnInit {
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
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    combineLatest(this.checklistItemService.entries, this._taskSubject)
      .pipe(
        map(([items, task]) => items.filter(x => x.taskUuid === (task && task.uuid)))
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
      order: this._task.nextChecklistOrder,
      taskUuid: this._task.uuid,
    });

    this._task.nextChecklistOrder = this._task.nextChecklistOrder + 1;
    this.taskService.update(this._task);

    this.newValue = "";
    // Prevent the enter button from adding a line after keyup.
    event.preventDefault();
  }

  move(item: ChecklistItem, direction: "up" | "down") {
    const curPos = this.items.indexOf(item);
    const otherPos = curPos + (direction === "up" ? 1 : -1);
    if (
      otherPos >= this.items.length // Current is already last
      || otherPos < 0  // Current is already first.
    ) {
      return;
    }

    const srcItem = this.items[curPos];
    const dstItem = this.items[otherPos];
    const t = srcItem.order;
    srcItem.order = dstItem.order;
    dstItem.order = t;

    this.checklistItemService.update(srcItem);
    this.checklistItemService.update(dstItem);
  }
}