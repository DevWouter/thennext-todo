import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MenuComponent } from './menu/menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  declarations: [
    MenuComponent,
    MenuItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [],
  providers: [],
})
export class GuiModule { }
