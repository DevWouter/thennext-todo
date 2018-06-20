import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ServicesModule } from "../services/services.module";

import { SettingsPageHeaderComponent } from "./settings-page-header/settings-page-header.component";
import { SettingsPageScoreshiftsComponent } from "./settings-page-scoreshifts/settings-page-scoreshifts.component";
import { SettingsPageTabScoringTagsComponent } from "./settings-page-tab-scoring-tags/settings-page-tab-scoring-tags.component";
// tslint:disable-next-line:max-line-length
import { SettingsPageTabScoringUrgencyLapsComponent } from "./settings-page-tab-scoring-urgency-laps/settings-page-tab-scoring-urgency-laps.component";
import { SettingsPageTabTasklistsComponent } from "./settings-page-tab-tasklists/settings-page-tab-tasklists.component";
import { SettingsPageTasklistsComponent } from "./settings-page-tasklists/settings-page-tasklists.component";
import { SettingsContentTiltleComponent } from "./settings-content-title/settings-content-title.component";
import { AcceptShareTokenComponent } from "./accept-share-token/accept-share-token.component";

import { SettingsPageTasklistCreatorComponent } from "./settings-page-tasklist-creator/settings-page-tasklist-creator.component";
import { SettingsPageTasklistItemComponent } from "./settings-page-tasklist-item/settings-page-tasklist-item.component";

import { TabTitlesComponent } from "./tab-titles/tab-titles.component";
import { AppSettingsRoutingModule } from "./settings.routing";
import { SettingsTasklistComponent } from "./settings-tasklist/settings-tasklist.component";
import { DialogsModule } from "../dialogs/dialogs.module";
import { SettingsPageUrgencyLapsComponent } from "./settings-page-urgency-laps/settings-page-urgency-laps.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ServicesModule,
    AppSettingsRoutingModule,
    DialogsModule,
  ],
  declarations: [
    TabTitlesComponent,
    SettingsPageTabTasklistsComponent,
    SettingsPageTabScoringTagsComponent,
    SettingsPageHeaderComponent,
    SettingsPageTasklistsComponent,
    SettingsPageScoreshiftsComponent,
    SettingsTasklistComponent,
    AcceptShareTokenComponent,
    SettingsContentTiltleComponent,
    SettingsPageTasklistItemComponent,
    SettingsPageTasklistCreatorComponent,
    SettingsPageTabScoringUrgencyLapsComponent,
    SettingsPageUrgencyLapsComponent,
  ],
  exports: [TabTitlesComponent]
})
export class SettingsPageModule { }
