import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MenuComponent,
  MenuItemCheckboxComponent,
  MenuSpacerComponent,
  MenuItemComponent
} from './menu';

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
