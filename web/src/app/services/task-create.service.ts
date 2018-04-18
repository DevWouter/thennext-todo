import { Injectable } from "@angular/core";
import { TaskService } from "./task.service";

@Injectable()
export class TaskCreateService {
  constructor(
    private taskService: TaskService,
  ) {
  }

  parseCommand(command: string): any {
    throw new Error("Method not implemented.");
  }
}
