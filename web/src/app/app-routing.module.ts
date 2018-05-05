import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { SettingsPageComponent } from "./settings-page/settings-page.component";
import { SettingsPageTabScoringComponent } from "./settings-page-tab-scoring/settings-page-tab-scoring.component";
import { SettingsPageTabTasklistsComponent } from "./settings-page-tab-tasklists/settings-page-tab-tasklists.component";
import { TaskPageComponent } from "./task-page/task-page.component";

const routes: Routes = [
  { path: "", component: HomepageComponent },
  { path: "create-account", component: CreateAccountPageComponent },
  { path: "login", component: LoginPageComponent },
  { path: "tasks", component: TaskPageComponent },
  {
    path: "settings", component: SettingsPageComponent, children: [
      { path: "tasklist", component: SettingsPageTabTasklistsComponent, outlet: "settings" },
      { path: "scoring", component: SettingsPageTabScoringComponent, outlet: "settings" },
      // By default set the outlet to generic-settings-tab
      { path: "", redirectTo: "/settings/(settings:tasklist)", pathMatch: "full" },
    ]
  },
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
