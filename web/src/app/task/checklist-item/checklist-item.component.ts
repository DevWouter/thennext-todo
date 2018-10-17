import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, OnDestroy } from "@angular/core";
import { filter } from "rxjs/operators";
import { ChecklistItem } from "../../models";
import {
  FocusService,
  ChecklistItemService,
} from "../../services";
import { Subscription } from "rxjs";

@Component({
  selector: "task-checklist-item",
  templateUrl: "./checklist-item.component.html",
  styleUrls: ["./checklist-item.component.scss"]
})
export class ChecklistItemComponent implements OnInit, OnDestroy {
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

  @Output()
  public selectNext = new EventEmitter<"prev" | "next">();

  private _item: ChecklistItem = undefined;
  @Input()
  public set item(v: ChecklistItem) {
    this._item = v;
  }

  public get item(): ChecklistItem {
    return this._item;
  }

  @ViewChild("input")
  private inputRef: ElementRef;

  private focusSubscription: Subscription;

  constructor(
    private readonly checklistItemService: ChecklistItemService,
    private readonly focusService: FocusService,
  ) { }

  ngOnInit() {
    this.focusSubscription = this.focusService.request.pipe(
      filter(x => x.type === "checklistItem"),
      filter(x => (this._item && x.uuid === this._item.uuid)),
    ).subscribe(() => {
      if (this.inputRef) {
        this.inputRef.nativeElement.focus();
      }
    });
  }

  ngOnDestroy() {
    if (this.focusSubscription) {
      this.focusSubscription.unsubscribe();
    }
  }

  @HostListener("keydown", ["$event"])
  up(e: KeyboardEvent) {
    if (!e.altKey) {
      return;
    }

    if (e.code === "KeyK") { // 'k'
      this.moveDown();
      e.preventDefault();
    }

    if (e.code === "KeyJ") { // 'j'
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

  moveSelection(action: "prev" | "next", e: Event) {
    e.preventDefault();
    this.selectNext.emit(action);
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
