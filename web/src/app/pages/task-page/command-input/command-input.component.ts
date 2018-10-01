import { Component, OnInit } from "@angular/core";
import { TaskParseService, CommandStateService } from "../../../services";


@Component({
  selector: "app-command-input",
  templateUrl: "./command-input.component.html",
  styleUrls: ["./command-input.component.scss"]
})
export class CommandInputComponent implements OnInit {
  private _value = "";
  public get value(): string {
    return this._value;
  }
  public set value(v: string) {
    this.commandStateService.setCommandText(v);
    this._value = v;
  }

  constructor(
    private readonly taskCreateService: TaskParseService,
    private readonly commandStateService: CommandStateService,
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
