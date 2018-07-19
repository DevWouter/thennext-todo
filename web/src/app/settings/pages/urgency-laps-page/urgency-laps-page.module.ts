import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
// External modules
import { SettingsSharedModule } from "../../shared/settings-shared.module";

// Main component
import { UrgencyLapsPageComponent } from "./urgency-laps-page.component";

// Sub component
import { SettingsPageUrgencyLapsComponent } from "./urgency-laps-edit-table/urgency-laps-edit-table.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SettingsSharedModule,
  ],
  declarations: [
    SettingsPageUrgencyLapsComponent,
    UrgencyLapsPageComponent
  ],
  exports: [
    UrgencyLapsPageComponent,
  ]
})
export class SettingsUrgencyLapsPageModule { }
