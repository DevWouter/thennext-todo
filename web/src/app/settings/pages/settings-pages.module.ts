import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

// External modules
import { SettingsSharedModule } from "../shared/settings-shared.module";

// Internal modules
import { SettingsTasklistDetailPageModule } from "./tasklist-detail-page/tasklist-detail-page.module";
import { SettingsTasklistListPageModule } from "./tasklist-list-page/tasklist-list-page.module";
import { SettingsTagsPageModule } from "./tags-page/tags-page.module";
import { SettingsUrgencyLapsPageModule } from "./urgency-laps-page/urgency-laps-page.module";

// Internal components

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SettingsSharedModule,

    SettingsTagsPageModule,
    SettingsUrgencyLapsPageModule,
    SettingsTasklistDetailPageModule,
    SettingsTasklistListPageModule,
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class SettingsPagesModule { }
