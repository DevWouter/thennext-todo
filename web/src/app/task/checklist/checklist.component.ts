import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { BehaviorSubject, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { ChecklistItem, Task } from "../../models";
import {
  ChecklistItemService,
  FocusService,
  TaskService,
} from "../../services";


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

  @ViewChild('input')
  private inputRef: ElementRef;

  @Input()
  public set task(v: Task) {
    this._task = v;
    this._taskSubject.next(v);
  }

  constructor(
    private readonly checklistItemService: ChecklistItemService,
    private readonly taskService: TaskService,
    private readonly focusService: FocusService,
  ) { }

  ngOnInit() {
    combineLatest(this.checklistItemService.entries, this._taskSubject)
      .pipe(
        map(([items, task]) => items.filter(x => x.taskUuid === (task && task.uuid)))
      )
      .subscribe(items => this.items = items);
  }

  selectNext(item: ChecklistItem, direction: "prev" | "next") {
    const currentIndex = this.items.indexOf(item);
    const nextIndex = currentIndex + (direction === "prev" ? -1 : 1);
    if (nextIndex < 0) {
      return;
    }

    if (nextIndex >= this.items.length) {
      console.log(arguments);
      this.inputRef.nativeElement.focus();
      return;
    }

    const nextItem = this.items[nextIndex];
    this.focusService.setFocus("checklistItem", nextItem.uuid);
  }

  async create(event: Event, select: "prev" | "next") {
    let prevLastItem: ChecklistItem = this.items && this.items.length > 0 && this.items[this.items.length - 1];
    const title = this.newValue.trim();
    if (title.length === 0) {
      this.newValue = "";
      event.preventDefault(); // Prevent return
      if (select === "prev" && prevLastItem) {
        this.focusService.setFocus("checklistItem", prevLastItem.uuid);
      }
      return;
    }


    const checklistItemCreatePromise = this.checklistItemService.add(<ChecklistItem>{
      checked: false,
      title: title,
      order: this._task.nextChecklistOrder,
      taskUuid: this._task.uuid,
    });

    this._task.nextChecklistOrder = this._task.nextChecklistOrder + 1;
    const taskUpdatePromise = this.taskService.update(this._task);
    this.newValue = "";

    // Prevent the enter button from adding a line after keyup.
    event.preventDefault();

    // Wait until both task and checklist have been updated.
    await checklistItemCreatePromise;
    await taskUpdatePromise;

    if (select === "next") {
      // We can keep the focus.
      return;
    } else {
      // We need to put the focus in the newly created item.
      if (prevLastItem) {
        this.focusService.setFocus("checklistItem", prevLastItem.uuid);
        return;
      } else {
        this.focusService.setFocus("checklistItem", (await checklistItemCreatePromise).uuid);
        return;
      }
    }

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
