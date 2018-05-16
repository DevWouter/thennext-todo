import { Component, OnInit } from "@angular/core";
import { NavigationService } from "../services/navigation.service";
import { TaskPageNavigation } from "../services/models/task-page-navigation";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
  selector: "app-homepage",
  templateUrl: "./homepage.component.html",
  styleUrls: ["./homepage.component.scss"]
})
export class HomepageComponent implements OnInit {
  exampleTasks = [
    "send frank the new offer",
    "ask mother about gift for dad",
    "call garage about the new idea",
    "grocery shopping",
    "sign up",
    "Another task",
    "send tax returns",
    "walk the dog",
    "ask Charles if Suzan is free",
  ];

  public exampletask = new BehaviorSubject<string>(undefined);

  constructor() { }

  ngOnInit() {
    const chosen = this.exampleTasks[Math.floor(Math.random() * this.exampleTasks.length)];
    this.exampletask.next(chosen);
  }

}
