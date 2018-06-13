import { Component, OnInit } from "@angular/core";
import { TaskListRightService } from "../../services/task-list-right.service";

@Component({
  selector: "app-accept-share-token",
  templateUrl: "./accept-share-token.component.html",
  styleUrls: ["./accept-share-token.component.scss"]
})
export class AcceptShareTokenComponent implements OnInit {
  taskListUuid = "";
  shareToken = "";

  constructor(
    private taskListRightService: TaskListRightService,
  ) { }

  ngOnInit() {
  }

  async accept() {
    const result = await this.taskListRightService.accept(this.taskListUuid, this.shareToken);

    if (result === true) {
      // We should have an extra value in the task-list.
    } else {
      // Something went wrong.
      alert("Unable to import the list");
    }
  }
}
