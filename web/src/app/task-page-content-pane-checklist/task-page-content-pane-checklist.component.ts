import { Component, OnInit } from "@angular/core";
import { ContextService } from "../services/context.service";
import { ChecklistItem } from "../services/models/checklist-item.dto";
import { ChecklistItemService } from "../services/checklist-item.service";
import { TaskView } from "../services/models/task-view";

@Component({
  selector: "app-task-page-content-pane-checklist",
  templateUrl: "./task-page-content-pane-checklist.component.html",
  styleUrls: ["./task-page-content-pane-checklist.component.scss"]
})
export class TaskPageContentPaneChecklistComponent implements OnInit {
  items: ChecklistItem[] = [];
  taskView: TaskView = undefined;
  newValue = "";
  constructor(
    private contextService: ContextService,
    private checklistItemService: ChecklistItemService,
  ) { }

  ngOnInit() {
    this.contextService.activeTaskChecklistItems
      .subscribe(items => this.items = items);
    this.contextService.activeTaskView
      .subscribe(v => this.taskView = v);
  }

  create(event: Event) {
    const title = this.newValue.trim();
    if (title.length === 0) {
      this.newValue = "";
      return;
    }

    this.checklistItemService.add(<ChecklistItem>{
      checked: false,
      title: title,
      taskUuid: this.taskView.task.uuid,
    });

    this.newValue = "";
    // Prevent the enter button from adding a line after keyup.
    event.preventDefault();
  }
}
