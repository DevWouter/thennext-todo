import { Component, OnInit } from "@angular/core";
import { TaskService } from "../services/task.service";

@Component({
  selector: "app-task-page-footer-input",
  templateUrl: "./task-page-footer-input.component.html",
  styleUrls: ["./task-page-footer-input.component.scss"]
})
export class TaskPageFooterInputComponent implements OnInit {

  value = "";
  constructor(
    private readonly taskService: TaskService,
  ) { }

  ngOnInit() {
  }

  submit() {
    this.processInput();
    this.clearInput();
  }

  clearInput(): void {
    this.value = "";
  }

  processInput(): void {
    const value = this.getCleanValue();
    this.taskService.parseCommand(value);
  }

  getCleanValue(): string {
    return this.value.trim();
  }
}
