import { Component, OnInit, Input } from "@angular/core";
import { Task } from "../services/models/task.dto";

@Component({
  selector: "app-task-page-content-list-item",
  templateUrl: "./task-page-content-list-item.component.html",
  styleUrls: ["./task-page-content-list-item.component.scss"]
})
export class TaskPageContentListItemComponent implements OnInit {

  score = 888.8;
  checked = false;
  get title() {
    return this.task.title;
  }

  showCommentIcon = true;
  showSleepIcon = true;
  showPlayIcon = true;

  @Input()
  task: Task;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.checked = !this.checked;
  }

}
