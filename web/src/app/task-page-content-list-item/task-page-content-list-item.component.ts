import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-task-page-content-list-item",
  templateUrl: "./task-page-content-list-item.component.html",
  styleUrls: ["./task-page-content-list-item.component.scss"]
})
export class TaskPageContentListItemComponent implements OnInit {

  score = 888.8;
  checked = false;
  title = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. " +
    "Cupiditate cumque inventore cum dignissimos velit, ullam eius nullaquod " +
    "qui dicta recusandae, consequuntur, accusantium eos nostrum autem " +
    "deserunt sunt ad rem.";

  showCommentIcon = true;
  showSleepIcon = true;
  showPlayIcon = true;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.checked = !this.checked;
  }

}
