import { Component, OnInit, Input } from "@angular/core";
import { TaskList } from "../../services/models/task-list.dto";
import { TaskListService } from "../../services/task-list.service";

@Component({
  selector: "app-settings-page-tasklist-item",
  templateUrl: "./settings-page-tasklist-item.component.html",
  styleUrls: ["./settings-page-tasklist-item.component.scss"]
})
export class SettingsPageTasklistItemComponent implements OnInit {
  @Input()
  tasklist: TaskList = undefined;

  @Input()
  owned = false;

  public get name(): string { return this.tasklist.name; }
  public set name(v: string) { this.tasklist.name = v; }

  public get canShowDetail(): boolean {
    return true;
  }

  public get canDelete(): boolean {
    return this.owned;
  }

  constructor(
    private readonly tasklistService: TaskListService,
  ) { }


  ngOnInit() {
  }

  delete() {
    this.tasklistService.delete(this.tasklist);
  }
}
