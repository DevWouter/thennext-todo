import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ConfirmAccountPageComponent } from "./confirm-account-page/confirm-account-page.component";
import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { SettingsPageComponent } from "./settings-page/settings-page.component";
import { TaskPageComponent } from "./task-page/task-page.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "create-account", component: CreateAccountPageComponent },
  { path: "confirm-account", component: ConfirmAccountPageComponent },
  { path: "login", component: LoginPageComponent },
  { path: "tasks", component: TaskPageComponent },
  { path: "settings", component: SettingsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
