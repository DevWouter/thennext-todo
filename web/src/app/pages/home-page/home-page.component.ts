import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "page-home",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.scss"]
})
export class HomePageComponent implements OnInit {
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
