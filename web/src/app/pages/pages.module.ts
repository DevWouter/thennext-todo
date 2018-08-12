import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { ServicesModule } from "../services/services.module";
import { DialogsModule } from "../dialogs/dialogs.module";

import { HomePageComponent } from "./home-page/home-page.component";
import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { ConfirmAccountPageComponent } from "./confirm-account-page/confirm-account-page.component";
import { AccountCreatedPageComponent } from "./account-created-page/account-created-page.component";

// Sub modules
import { TaskPageModule } from "./task-page/task-page.module";
import { SettingsPageModule } from "./settings-page/settings-page.module";
import { SharedPagesModule } from "./shared/shared.module";

// Routing module
import { PagesRoutingModule } from "./pages.routing";

@NgModule({
  imports: [
    CommonModule,
    RouterModule, // Required for navigation links
    FormsModule,
    ServicesModule,
    DialogsModule,
    SharedPagesModule,
    TaskPageModule,
    SettingsPageModule,
  ],
  declarations: [
    HomePageComponent,
    CreateAccountPageComponent,
    LoginPageComponent,
    ConfirmAccountPageComponent,
    AccountCreatedPageComponent,
  ],
  exports: [
    HomePageComponent,
    CreateAccountPageComponent,
    LoginPageComponent,

    PagesRoutingModule,
  ]
})
export class PagesModule { }
