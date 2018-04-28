import { Task } from "./task.dto";

export class TaskView {
  /**
   * The score of the task.
   */
  score = 0;

  /**
   * The original task
   */
  task: Task;

  isBlocking = false;
  isBlocked = false;
  isDelayed = false;

  public constructor(task: Task) {
    this.task = task;
  }
}
