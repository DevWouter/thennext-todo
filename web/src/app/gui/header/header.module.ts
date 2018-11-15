import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "./header.component";

import { HeaderButtonIconComponent } from "./header-button-icon/header-button-icon.component";
import { HeaderTextComponent } from "./header-text/header-text.component";

const components = [
  HeaderComponent,

  HeaderButtonIconComponent,
  HeaderTextComponent
];

@NgModule({
  imports: [CommonModule],
  declarations: [...components],
  exports: [...components],
  providers: [],
})
export class HeaderModule { }
