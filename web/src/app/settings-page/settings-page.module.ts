import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ServicesModule } from "../services/services.module";

import { SettingsPageHeaderComponent } from "./settings-page-header/settings-page-header.component";
import { SettingsPageScoreshiftsComponent } from "./settings-page-scoreshifts/settings-page-scoreshifts.component";
import { SettingsPageTabScoringComponent } from "./settings-page-tab-scoring/settings-page-tab-scoring.component";
import { SettingsPageTabTasklistsComponent } from "./settings-page-tab-tasklists/settings-page-tab-tasklists.component";
import { SettingsPageTasklistsComponent } from "./settings-page-tasklists/settings-page-tasklists.component";

import { TabTitlesComponent } from "./tab-titles/tab-titles.component";
import { AppSettingsRoutingModule } from "./settings.routing";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ServicesModule,
    AppSettingsRoutingModule,
  ],
  declarations: [
    TabTitlesComponent,
    SettingsPageTabTasklistsComponent,
    SettingsPageTabScoringComponent,
    SettingsPageHeaderComponent,
    SettingsPageTasklistsComponent,
    SettingsPageScoreshiftsComponent,
  ],
  exports: [TabTitlesComponent]
})
export class SettingsPageModule { }
