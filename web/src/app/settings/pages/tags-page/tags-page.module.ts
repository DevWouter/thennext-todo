import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
// External modules
import { SettingsSharedModule } from "../../shared/settings-shared.module";

// Main component
import { SettingsTagsPageComponent } from "./tags-page.component";

// Sub component
import { SettingsTagsEditTableComponent } from "./tags-edit-table/tags-edit-table.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SettingsSharedModule,
  ],
  declarations: [
    SettingsTagsEditTableComponent,
    SettingsTagsPageComponent,
  ],
  exports: [
    SettingsTagsPageComponent,
  ]
})
export class SettingsTagsPageModule { }
