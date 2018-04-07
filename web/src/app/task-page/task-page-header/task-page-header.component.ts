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
    this.refreshTaskList();
  }

  createNewTaskList() {
    let result = prompt("Please enter the name of the new tasklist") || "";
    result = result.trim();
    if (result.length === 0) {
      return;
    }

    this.taskListService.createTaskList(result);
  }

  refreshTaskList() {
    this.taskListService.getTaskLists().then(x => this.lists = x.taskLists);
  }
}
