import { Injectable } from "@angular/core";
import { Task, TaskStatus } from "./models/task.dto";
import { TaskService } from "./task.service";
import { TaskListService } from "./task-list.service";
import { NavigationService } from "./navigation.service";

@Injectable()
export class TaskParseService {
  private taskListUuid: string = undefined;
  private _primaryTaskListUuid: string = undefined;

  constructor(
    private taskService: TaskService,
    private taskListService: TaskListService,
    private navigation: NavigationService,
  ) {
    this.setup();
  }

  createTask(command: string): void {
    command = command.trim();
    if (command.length === 0) {
      return;
    }

    const title = command;

    const taskListUuid = this.taskListUuid || this._primaryTaskListUuid;
    if (taskListUuid === undefined) {
      throw new Error("No tasklist Uuid is known");
    }

    const newTask = <Task>{
      taskListUuid: taskListUuid,
      status: TaskStatus.todo,
      title: title,
      nextChecklistOrder: 1,
    };

    this.taskService.add(newTask);
  }

  private setup() {
    this.navigation.taskListUuid.subscribe(x => this.taskListUuid = x);
    this.taskListService.entries
      .map(taskLists => taskLists.find(y => y.primary))
      .subscribe(taskList => {
        if (taskList) {
          this._primaryTaskListUuid = taskList.uuid;
        } else {
          this._primaryTaskListUuid = undefined;
        }
      });
  }
}
