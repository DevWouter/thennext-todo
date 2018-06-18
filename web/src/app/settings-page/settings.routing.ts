import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SettingsPageTabScoringComponent } from "./settings-page-tab-scoring/settings-page-tab-scoring.component";
import { SettingsPageTabTasklistsComponent } from "./settings-page-tab-tasklists/settings-page-tab-tasklists.component";
import { SettingsTasklistComponent } from "./settings-tasklist/settings-tasklist.component";

const routes: Routes = [
  {
    path: "settings", children: [
      { path: "tasklists", component: SettingsPageTabTasklistsComponent },
      { path: "tasklists/:uuid", component: SettingsTasklistComponent },
      { path: "scoring", component: SettingsPageTabScoringComponent },
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
