import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MenuComponent } from "./menu.component";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { MenuSpacerComponent } from "./menu-spacer/menu-spacer.component";
import { MenuItemCheckboxComponent } from "./menu-item-checkbox/menu-item-checkbox.component";
import { MenuBarComponent } from "./menu-bar/menu-bar.component";

const publicComponents = [
  MenuComponent,
  MenuItemComponent,
  MenuSpacerComponent,
  MenuBarComponent,
  MenuItemCheckboxComponent,
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
