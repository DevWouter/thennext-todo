import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { TaskPageComponent } from "./task-page/task-page.component";
import { HomePageComponent } from "./home-page/home-page.component";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "create-account", component: CreateAccountPageComponent },
  { path: "login", component: LoginPageComponent },
  { path: "tasks", component: TaskPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
