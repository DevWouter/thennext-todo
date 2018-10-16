import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuModule } from './menu/menu.module';


@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
  ],
  exports: [
    MenuModule,
  ],
  providers: [],
})
export class GuiModule { }
