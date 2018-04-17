import { Component, OnInit } from "@angular/core";
import { TaskListService } from "../services/task-list.service";

@Component({
  selector: "app-task-page-header",
  templateUrl: "./task-page-header.component.html",
  styleUrls: ["./task-page-header.component.scss"]
})
export class TaskPageHeaderComponent implements OnInit {
  showFilterMenu = false;
  lists: { uuid: string, primary: boolean, name }[] = [];
  constructor(
    private taskListService: TaskListService,
  ) { }

  ngOnInit() {
    this.taskListService.entries.subscribe(x => this.lists = x);
  }

  toggleFilterMenu() {
    this.showFilterMenu = !this.showFilterMenu;
  }
  createNewTaskList() {
    let result = prompt("Please enter the name of the new tasklist") || "";
    result = result.trim();
    if (result.length === 0) {
      return;
    }

    this.taskListService.createTaskList(result);
  }

}
