import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-task-page-content-pane-tags",
  templateUrl: "./task-page-content-pane-tags.component.html",
  styleUrls: ["./task-page-content-pane-tags.component.scss"]
})
export class TaskPageContentPaneTagsComponent implements OnInit {
  tags: { title: string }[] = [
    { title: "later" },
    { title: "A very long tag that covers multiple lines and causes a line break" }
  ];

  constructor() { }

  ngOnInit() {
  }

}
