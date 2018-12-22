import { Component, OnInit, Input } from "@angular/core";
import { TaskList } from "../../models";

@Component({
  selector: "app-tasklist-settings-keyinput-panel",
  templateUrl: "./tasklist-settings-keyinput-panel.component.html",
  styleUrls: ["./tasklist-settings-keyinput-panel.component.scss"]
})
export class TasklistSettingsKeyinputPanelComponent implements OnInit {
  @Input() tasklist: TaskList;

  constructor() { }

  ngOnInit() {
  }

}
