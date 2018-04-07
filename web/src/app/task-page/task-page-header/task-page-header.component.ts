import { Component, OnInit } from "@angular/core";
import { TaskListService } from "../../services/task-list.service";

@Component({
  selector: "app-task-page-header",
  templateUrl: "./task-page-header.component.html",
  styleUrls: ["./task-page-header.component.scss"]
})
export class TaskPageHeaderComponent implements OnInit {

  lists: { uuid: string, primary: boolean, name }[] = [];
  constructor(
    private taskListService: TaskListService,
  ) { }

  ngOnInit() {
    this.taskListService.getTaskLists().then(x => this.lists = x.taskLists);
  }

}
