import { Injectable } from "@angular/core";
import { Task, TaskStatus } from "./models/task.dto";
import { TaskService } from "./task.service";

@Injectable()
export class TaskParseService {
  constructor(
    private taskService: TaskService
  ) { }

  createTask(command: string, taskListUuid: string): void {
    command = command.trim();
    if (command.length === 0) {
      return;
    }

    const title = command;

    const newTask = <Task>{
      taskListUuid: taskListUuid,
      status: TaskStatus.todo,
      title: title,
    };

    this.taskService.add(newTask);
  }
}
