import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "gui-header-button-icon",
  templateUrl: "./header-button-icon.component.html",
  styleUrls: ["./header-button-icon.component.scss"]
})
export class HeaderButtonIconComponent implements OnInit {
  @Input()
  iconClass: string;

  constructor() { }

  ngOnInit(): void { }
}
