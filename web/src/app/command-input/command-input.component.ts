import { Component, OnInit } from "@angular/core";
import { TaskParseService } from "../services/task-parse.service";

@Component({
  selector: "app-command-input",
  templateUrl: "./command-input.component.html",
  styleUrls: ["./command-input.component.scss"]
})
export class CommandInputComponent implements OnInit {
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
