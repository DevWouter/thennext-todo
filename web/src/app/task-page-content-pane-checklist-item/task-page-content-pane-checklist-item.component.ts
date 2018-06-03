import { Component, OnInit, Input, Output, EventEmitter, HostListener, Host } from "@angular/core";
import { ChecklistItem } from "../services/models/checklist-item.dto";
import { ChecklistItemService } from "../services/checklist-item.service";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, combineLatest, debounceTime } from "rxjs/operators";

@Component({
  selector: "app-task-page-content-pane-checklist-item",
  templateUrl: "./task-page-content-pane-checklist-item.component.html",
  styleUrls: ["./task-page-content-pane-checklist-item.component.scss"]
})
export class TaskPageContentPaneChecklistItemComponent implements OnInit {
  private _changeSubject = new Subject();
  private _titleSubject = new BehaviorSubject<string>(undefined);
  public get title(): string { return this._item.title; }
  public set title(v: string) { this._item.title = v; this._titleSubject.next(v); this._changeSubject.next(); }

  private _checkedSubject = new BehaviorSubject<boolean>(undefined);
  public get checked(): boolean { return this._item.checked; }
  public set checked(v: boolean) { this._item.checked = v; this._checkedSubject.next(v); this._changeSubject.next(); }

  @Output()
  public move = new EventEmitter<"up" | "down">();

  private _item: ChecklistItem = undefined;
  @Input()
  public set item(v: ChecklistItem) {
    // Mark as complete.
    this._titleSubject.complete();
    this._checkedSubject.complete();


    this._item = v;

    this._titleSubject = new BehaviorSubject<string>(v.title);
    this._checkedSubject = new BehaviorSubject<boolean>(v.checked);

    // Update is not called when the new title is empty
    this._titleSubject
      .pipe(filter(x => x !== undefined && x.length !== 0),
        combineLatest(this._checkedSubject, (title, checked) => {
          v.title = title;
          v.checked = checked;
          return v;
        }),
        combineLatest(this._changeSubject, (x, _) => x),
        debounceTime(350))
      .subscribe(x => {
        this.checklistItemService.update(x);
      });
  }

  public get item(): ChecklistItem {
    return this._item;
  }

  constructor(
    private readonly checklistItemService: ChecklistItemService,
  ) { }

  @HostListener("keydown", ["$event"])
  up(e: KeyboardEvent) {
    if (!e.altKey) {
      return;
    }

    if (e.keyCode === 74) { // 'k'
      this.move.emit("down");
      e.preventDefault();
    }

    if (e.keyCode === 75) { // 'j'
      this.move.emit("up");
      e.preventDefault();
    }
  }

  ngOnInit() {
  }

  updateTitle() {
    if (this._item.title.length === 0) {
      this.checklistItemService.delete(this._item);
    }
  }

  toggle() {
    this.checked = !this.checked;
  }
}
