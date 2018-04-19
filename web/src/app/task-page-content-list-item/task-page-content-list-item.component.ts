import { Component, OnInit, Input, HostListener } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { Task } from "../services/models/task.dto";
import { NavigationService } from "../services";

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
    return this.task.title;
  }

  showCommentIcon = true;
  showSleepIcon = true;
  showPlayIcon = true;

  @Input()
  task: Task;

  /**
   * Make the object selected when clicked upon.
   */
  @HostListener("click") onClick() {
    this.navigation.toTaskPage({ taskUuid: this.task.uuid });
  }

  constructor(
    private navigation: NavigationService,
  ) { }

  ngOnInit() {
    this.navigation.taskUuid.subscribe(x => {
      if (this.task.uuid === x) {
        this.state = "selected";
      } else {
        this.state = "default";
      }
    });
  }

  toggle() {
    this.checked = !this.checked;
  }

}
