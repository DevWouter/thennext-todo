import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'gui-menu-item-checkbox',
  templateUrl: './menu-item-checkbox.component.html',
  styleUrls: ['./menu-item-checkbox.component.scss', '../menu-item/menu-item.component.scss']
})
export class MenuItemCheckboxComponent implements OnInit {
  constructor() { }

  @Input()
  checked: boolean;

  ngOnInit(): void { }
}
