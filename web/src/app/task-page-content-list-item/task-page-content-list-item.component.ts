import { Component, OnInit, Input, HostListener } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { Task, TaskStatus } from "../services/models/task.dto";
import { NavigationService } from "../services";
import { TaskService } from "../services/task.service";
import { TaskView } from "../services/models/task-view";

@Component({
  selector: "app-task-page-content-list-item",
  templateUrl: "./task-page-content-list-item.component.html",
  styleUrls: ["./task-page-content-list-item.component.scss"],
  animations: [
    trigger("taskState", [
      state("default", style({
        // backgroundColor: 'white',
      })),
      state("new", style({
        backgroundColor: "yellow",
      })),
      state("selected", style({
        backgroundColor: "#e1f2fe",
      })),
      transition("new => default", animate("1000ms ease-in")),
    ])
  ]
})
export class TaskPageContentListItemComponent implements OnInit {
  state = "default";
  score = 888.8;
  checked = false;
  get title() {
    return this.taskView.task.title;
  }

  showCommentIcon = true;
  showSleepIcon = true;
  showPlayIcon = true;

  private _task: TaskView;
  @Input()
  set taskView(v: TaskView) { this._task = v; this.updateTask(); }
  get taskView(): TaskView { return this._task; }

  @HostListener("click") onClick() {
    this.navigation.toTaskPage({ taskUuid: this.taskView.task.uuid });
  }

  constructor(
    private navigation: NavigationService,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.navigation.taskUuid.subscribe(x => {
      if (this.taskView.task.uuid === x) {
        this.state = "selected";
      } else {
        this.state = "default";
      }
    });
  }

  toggle() {
    this.checked = !this.checked;
    if (this.checked) {
      this.taskView.task.status = TaskStatus.done;
    } else {
      this.taskView.task.status = TaskStatus.todo;
    }

    this.taskService.update(this.taskView.task);
  }

  updateTask() {
    if (this.taskView) {
      this.checked = this.taskView.task.status === TaskStatus.done;
    }
  }
}
