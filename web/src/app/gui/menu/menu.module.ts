import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MenuComponent } from "./menu.component";

import { MenuItemCheckboxComponent } from "./menu-item-checkbox/menu-item-checkbox.component";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { MenuSpacerComponent } from "./menu-spacer/menu-spacer.component";
import { MenuTasklistComponent } from "./menu-tasklist/menu-tasklist.component";
import { MenuTasklistItemComponent } from "./menu-tasklist-item/menu-tasklist-item.component";

const publicComponents = [
  MenuComponent,

  MenuItemCheckboxComponent,
  MenuItemComponent,
  MenuSpacerComponent,
  MenuTasklistComponent,
  MenuTasklistItemComponent,
];

const privateComponents = [
];

@NgModule({
  declarations: [
    ...publicComponents,
    ...privateComponents,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ...publicComponents,
  ],
  providers: [],
})
export class MenuModule { }
