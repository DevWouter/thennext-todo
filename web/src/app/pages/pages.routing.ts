import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountCreatedPageComponent } from "./account-created-page/account-created-page.component";
import { ConfirmAccountPageComponent } from "./confirm-account-page/confirm-account-page.component";
import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { ForgetPasswordPageComponent } from "./forget-password-page/forget-password-page.component";
import { HomePageComponent } from "./home-page/home-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { RecoverAccountPageComponent } from "./recover-account-page/recover-account-page.component";
import { SchedulePageComponent } from './schedule-page';
import { TaskPageComponent } from "./task-page/task-page.component";

// Guard modules
import { SessionTokenGuard } from "../guards/session-token.guard";

const routes: Routes = [
  { path: "", component: HomePageComponent },
  { path: "account-created", component: AccountCreatedPageComponent },
  { path: "confirm-account", component: ConfirmAccountPageComponent },
  { path: "create-account", component: CreateAccountPageComponent },
  { path: "forget-password", component: ForgetPasswordPageComponent },
  { path: "login", component: LoginPageComponent },
  { path: "recover-account", component: RecoverAccountPageComponent },
  { path: "schedule", component: SchedulePageComponent, canActivate: [SessionTokenGuard] },
  { path: "tasks", component: TaskPageComponent, canActivate: [SessionTokenGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
