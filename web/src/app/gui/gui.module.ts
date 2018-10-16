import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuSpacerComponent } from './menu-spacer/menu-spacer.component';
import { MenuItemCheckboxComponent } from './menu-item-checkbox/menu-item-checkbox.component';

@NgModule({
  declarations: [
    MenuComponent,
    MenuItemComponent,
    MenuSpacerComponent,
    MenuItemCheckboxComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    MenuComponent,
    MenuItemComponent,
    MenuSpacerComponent,
    MenuItemCheckboxComponent
  ],
  providers: [],
})
export class GuiModule { }
