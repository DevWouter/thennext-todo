import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomepageComponent } from "./homepage/homepage.component";
import { TaskPageComponent } from "./task-page/task-page.component";
import { SettingsPageComponent } from "./settings-page/settings-page.component";

const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "tasks", component: TaskPageComponent },
  { path: "settings", component: SettingsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
