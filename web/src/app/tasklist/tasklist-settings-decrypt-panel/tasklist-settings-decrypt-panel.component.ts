import { Component, OnInit, Input } from "@angular/core";
import { TaskList } from "../../models";

@Component({
  selector: "app-tasklist-settings-decrypt-panel",
  templateUrl: "./tasklist-settings-decrypt-panel.component.html",
  styleUrls: ["./tasklist-settings-decrypt-panel.component.scss"]
})
export class TasklistSettingsDecryptPanelComponent implements OnInit {
  @Input() tasklist: TaskList;

  constructor() { }

  ngOnInit() {
  }

}
