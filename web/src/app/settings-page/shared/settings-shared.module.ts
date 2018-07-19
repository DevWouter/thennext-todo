import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";


import { TabTitlesComponent } from "./tab-titles/tab-titles.component";
import { DialogsModule } from "../../dialogs/dialogs.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DialogsModule,
  ],
  declarations: [
    TabTitlesComponent,
  ],
  exports: [TabTitlesComponent]
})
export class SettingsSharedModule { }
