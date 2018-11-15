import { Component, OnInit } from "@angular/core";
import { MessageBusStateService } from "../../services/message-bus";

@Component({
  selector: "app-settings-page",
  templateUrl: "./settings-page.component.html",
  styleUrls: ["./settings-page.component.scss"]
})
export class SettingsPageComponent implements OnInit {
  constructor(
    private readonly messageBusStateService: MessageBusStateService,
  ) { }

  ngOnInit(): void {
    this.messageBusStateService.set("open");
   }
}
