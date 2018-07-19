import { Component, OnInit, Input } from "@angular/core";
import { TaskList } from "../../../../models";
import { TaskListService } from "../../../../services";

@Component({
  selector: "settings-tasklist-item",
  templateUrl: "./tasklist-item.component.html",
  styleUrls: ["./tasklist-item.component.scss"]
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
