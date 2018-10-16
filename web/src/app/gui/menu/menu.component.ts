import { Component, OnInit, Input } from '@angular/core';

type MenuState = "opened" | "closed";

@Component({
  selector: 'gui-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input()
  menuTitle = "";

  expand = false;

  constructor() { }

  ngOnInit(): void { }

  open(): any {
    this.expand = true;
  }
  close(): any {
    this.expand = false;
  }
}
