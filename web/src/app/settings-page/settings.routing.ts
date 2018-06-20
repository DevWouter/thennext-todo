import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SettingsPageTabScoringTagsComponent } from "./settings-page-tab-scoring-tags/settings-page-tab-scoring-tags.component";
import { SettingsPageTabTasklistsComponent } from "./settings-page-tab-tasklists/settings-page-tab-tasklists.component";
import { SettingsTasklistComponent } from "./settings-tasklist/settings-tasklist.component";
// tslint:disable-next-line:max-line-length
import { SettingsPageTabScoringUrgencyLapsComponent } from "./settings-page-tab-scoring-urgency-laps/settings-page-tab-scoring-urgency-laps.component";

const routes: Routes = [
  {
    path: "settings", children: [
      { path: "tasklists", component: SettingsPageTabTasklistsComponent },
      { path: "tasklists/:uuid", component: SettingsTasklistComponent },
      { path: "tag-scoring", component: SettingsPageTabScoringTagsComponent },
      { path: "urgency-laps", component: SettingsPageTabScoringUrgencyLapsComponent },
      // By default set the outlet to generic-settings-tab
      { path: "", redirectTo: "tasklists", pathMatch: "full" },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppSettingsRoutingModule { }
