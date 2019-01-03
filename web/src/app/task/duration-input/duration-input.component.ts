import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { Task } from '../../models';
import { TaskService, } from '../../services';

@Component({
  selector: 'app-duration-input',
  templateUrl: './duration-input.component.html',
  styleUrls: ['./duration-input.component.scss']
})
export class DurationInputComponent implements OnInit {
  public readonly maxMinutes = 1440;
  @Input() public task: Task;
  @ViewChild("input") inputEl: ElementRef;

  constructor(
    private readonly taskService: TaskService,
  ) { }

  ngOnInit() {
  }

  onChange(ev: Event, v: string) {
    v = (v || "").trim();
    if (v === "") {
      this.task.estimatedDuration = null;
      this.taskService.update(this.task);
      return;
    }

    if (!/^[0-9]+$/.test(v)) {
      // Is not a number, reject the chnage
      (this.inputEl.nativeElement as HTMLInputElement).value = this.durationInUnits();
      ev.preventDefault();
      return;
    }

    let vi = parseInt(v);

    vi = Math.min(vi, this.maxMinutes);
    const nv = vi * 60;
    if (nv !== this.task.estimatedDuration) {
      this.task.estimatedDuration = nv;
      this.taskService.update(this.task);
    }

    // Always restore the value.
    (this.inputEl.nativeElement as HTMLInputElement).value = this.durationInUnits();
  }

  public durationInUnits(): string {
    if (this.task.estimatedDuration === null || this.task.estimatedDuration === undefined) {
      return "";
    }

    return (this.task.estimatedDuration / 60).toString(10);
  }
}
