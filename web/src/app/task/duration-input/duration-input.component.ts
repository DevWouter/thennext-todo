import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../../models';
import { TaskService } from '../../services';

type DurationType =
  "second(s)" |
  "minute(s)" |
  "hour(s)" |
  "day(s)";

@Component({
  selector: 'app-duration-input',
  templateUrl: './duration-input.component.html',
  styleUrls: ['./duration-input.component.scss']
})
export class DurationInputComponent implements OnInit {

  @Input() task: Task;

  get durationValue(): string {
    if (typeof this.task.estimatedDuration !== "number") {
      return "";
    }

    const seconds = this.task.estimatedDuration;
    if (seconds === 0) {
      return "0m";
    }
    if (seconds % (60 * 60 * 24) === 0) {
      return (seconds / (60 * 60 * 24)).toString(10) + "d";
    }
    if (seconds % (60 * 60) === 0) {
      return (seconds / (60 * 60)).toString(10) + "h";
    }
    if (seconds % 60 === 0) {
      return (seconds / 60).toString(10) + "m";
    }

    return seconds.toString(10) + "s";
  }

  set durationValue(v: string) {
    v = (v || "").trim().toLowerCase();
    v = v.split(" ").filter(x => x.trim().length).join();

    const r = /^([0-9]+)([dhms])$/.exec(v);

    if (r === null) {
      this.task.estimatedDuration = null;
      this.taskService.update(this.task);
      return;
    }

    const amount = parseInt(r[1], 10);
    const unit_type = r[2] as "d" | "h" | "m" | "s";

    const seconds = this.toSeconds(amount, unit_type);
    this.task.estimatedDuration = seconds;
    this.taskService.update(this.task);
  }

  constructor(
    private readonly taskService: TaskService,
  ) { }

  ngOnInit() {
  }

  selectContent(el: HTMLInputElement) {
    el.setSelectionRange(0, (el.value || "0m").length - 1);
  }

  private toSeconds(value: number | undefined, type: "d" | "h" | "m" | "s"): number | undefined {
    if (value == undefined) {
      return undefined;
    }

    switch (type) {
      case "s": return value;
      case "m": return value * 60;
      case "h": return value * 60 * 60;
      case "d": return value * 60 * 60 * 24;
      default: {
        throw new Error(`undefined DurationType ${type}`);
      }
    }
  }

}
