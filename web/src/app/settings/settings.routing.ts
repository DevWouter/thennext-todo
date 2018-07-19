import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TasklistListPageComponent } from "./pages/tasklist-list-page/tasklist-list-page.component";
import { TasklistDetailPageComponent } from "./pages/tasklist-detail-page/tasklist-detail-page.component";
import { UrgencyLapsPageComponent } from "./pages/urgency-laps-page/urgency-laps-page.component";
import { SettingsTagsPageComponent } from "./pages/tags-page/tags-page.component";


const routes: Routes = [
  {
    path: "settings", children: [
      { path: "tasklists", component: TasklistListPageComponent },
      { path: "tasklists/:uuid", component: TasklistDetailPageComponent },
      { path: "tag-scoring", component: SettingsTagsPageComponent },
      { path: "urgency-laps", component: UrgencyLapsPageComponent },
      // By default set the outlet to generic-settings-tab
      { path: "", redirectTo: "tasklists", pathMatch: "full" },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
