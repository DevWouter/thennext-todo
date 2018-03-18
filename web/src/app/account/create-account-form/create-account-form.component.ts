import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-create-account-form",
  templateUrl: "./create-account-form.component.html",
  styleUrls: ["./create-account-form.component.scss"]
})
export class CreateAccountFormComponent implements OnInit {
  username = "";
  password = "";
  response: any = undefined;

  constructor() { }

  ngOnInit() {
  }

  submit() {
    this.response = "test";
  }

}
