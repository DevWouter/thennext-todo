import { Component, OnInit } from "@angular/core";
import { TaskService } from "../services/task.service";
import { Task } from "../services/models/task.dto";
import { ContextService } from "../services/context.service";
import { TaskView } from "../services/models/task-view";

const score_func = (n: number) => Math.floor(n * 10);

@Component({
  selector: "app-task-page-content-list",
  templateUrl: "./task-page-content-list.component.html",
  styleUrls: ["./task-page-content-list.component.scss"]
})
export class TaskPageContentListComponent implements OnInit {
  public taskViews: TaskView[] = [];
  constructor(
    private readonly taskService: TaskService,
    private readonly contextService: ContextService,
  ) {
    this.contextService.visibleTasks
      .distinctUntilChanged((before, after): boolean => {
        if (before.length !== after.length) {
          return false;
        }

        for (let i = 0; i < before.length; ++i) {
          const old_uuid = before[i].task.uuid;
          const new_uuid = after[i].task.uuid;
          if (old_uuid !== new_uuid) {
            return false;
          }

          // Also need to check for isDelayed, because it is reliant on time.
          const old_delayed = before[i].isDelayed;
          const new_delayed = after[i].isDelayed;

          if (old_delayed !== new_delayed) {
            return false;
          }

          const old_score = score_func(before[i].score);
          const new_score = score_func(after[i].score);

          if (old_score !== new_score) {
            return false;
          }
        }

        // Still the same
        return true;
      })
      .subscribe(tasks => this.taskViews = tasks);
  }

  ngOnInit() {
  }

}
