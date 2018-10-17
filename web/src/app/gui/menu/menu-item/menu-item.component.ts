import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "gui-menu-item",
  templateUrl: "./menu-item.component.html",
  styleUrls: ["./menu-item.component.scss"]
})
export class MenuItemComponent implements OnInit {
  @Input()
  iconClass: string;
  constructor() { }

  ngOnInit(): void { }
}
