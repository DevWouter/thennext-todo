import { Component, OnInit, Input, Output, EventEmitter, HostListener, Host } from "@angular/core";
import { ChecklistItem } from "../services/models/checklist-item.dto";
import { ChecklistItemService } from "../services/checklist-item.service";
import { BehaviorSubject, Subject } from "rxjs";

@Component({
  selector: "app-task-page-content-pane-checklist-item",
  templateUrl: "./task-page-content-pane-checklist-item.component.html",
  styleUrls: ["./task-page-content-pane-checklist-item.component.scss"]
})
export class TaskPageContentPaneChecklistItemComponent implements OnInit {
  public get title(): string { return this._item && this._item.title; }
  public set title(v: string) {
    if (!this._item) { return; }
    if (this._item.title === v) { return; }

    this._item.title = v;
    this.checklistItemService.update(this._item);
  }

  public get checked(): boolean { return this._item && this._item.checked; }
  public set checked(v: boolean) {
    if (!this._item) { return; }
    if (this._item.checked === v) { return; }

    this._item.checked = v;
    this.checklistItemService.update(this._item);
  }

  @Output()
  public move = new EventEmitter<"up" | "down">();

  private _item: ChecklistItem = undefined;
  @Input()
  public set item(v: ChecklistItem) {
    this._item = v;
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
      this.moveDown();
      e.preventDefault();
    }

    if (e.keyCode === 75) { // 'j'
      this.moveUp();
      e.preventDefault();
    }
  }

  moveUp() {
    this.move.emit("up");
  }

  moveDown() {
    this.move.emit("down");
  }

  select(action: "prev" | "next", e: Event) {
    e.preventDefault();
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
