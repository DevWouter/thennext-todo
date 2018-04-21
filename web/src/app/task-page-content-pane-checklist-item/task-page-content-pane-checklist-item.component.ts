import { Component, OnInit, Input } from "@angular/core";
import { ChecklistItem } from "../services/models/checklist-item.dto";
import { ChecklistItemService } from "../services/checklist-item.service";

@Component({
  selector: "app-task-page-content-pane-checklist-item",
  templateUrl: "./task-page-content-pane-checklist-item.component.html",
  styleUrls: ["./task-page-content-pane-checklist-item.component.scss"]
})
export class TaskPageContentPaneChecklistItemComponent implements OnInit {

  public title: string;
  public checked = false;

  @Input()
  public item: ChecklistItem;

  constructor(
    private readonly checklistItemService: ChecklistItemService,
  ) { }

  ngOnInit() {
    this.title = this.item.title;
    this.checked = this.item.checked;
  }

  updateTitle() {
    console.log("updateTitle", this.item.title, this.title);
    if (this.item.title === this.title) {
      // No changes.
      return;
    }

    this.item.title = this.title;
    if (this.item.title.length === 0) {
      this.checklistItemService.delete(this.item);
    } else {
      this.checklistItemService.update(this.item);
    }
  }

  toggle() {
    this.checked = !this.checked;
    this.item.checked = this.checked;
    this.checklistItemService.update(this.item);
  }
}
