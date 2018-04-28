import { Component, OnInit } from "@angular/core";
import { TaskService } from "../services/task.service";
import { TaskParseService } from "../services/task-parse.service";

@Component({
  selector: "app-task-page-footer-input",
  templateUrl: "./task-page-footer-input.component.html",
  styleUrls: ["./task-page-footer-input.component.scss"]
})
export class TaskPageFooterInputComponent implements OnInit {

  value = "";
  constructor(
    private readonly taskCreateService: TaskParseService,
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
    this.taskCreateService.createTask(value);
  }

  getCleanValue(): string {
    return this.value.trim();
  }
}
