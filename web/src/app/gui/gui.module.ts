import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MenuModule } from "./menu/menu.module";
import { HeaderModule } from "./header/header.module";

const modules = [
  HeaderModule,
  MenuModule,
];


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ...modules,
  ],
  exports: [
    ...modules,
  ],
  providers: [],
})
export class GuiModule { }
