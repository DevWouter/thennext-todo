import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { ServicesModule } from "../services/services.module";
import { DialogsModule } from "../dialogs/dialogs.module";

import { HomePageComponent } from "./home-page/home-page.component";
import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";

// Sub modules
import { TaskPageModule } from "./task-page/task-page.module";

// Routing module
import { PagesRoutingModule } from "./pages.routing";
import { SettingsPageModule } from "./settings-page/settings-page.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule, // Required for navigation links
    FormsModule,
    ServicesModule,
    DialogsModule,
    TaskPageModule,
    SettingsPageModule,
  ],
  declarations: [
    HomePageComponent,
    CreateAccountPageComponent,
    LoginPageComponent,
  ],
  exports: [
    HomePageComponent,
    CreateAccountPageComponent,
    LoginPageComponent,

    PagesRoutingModule,
  ]
})
export class PagesModule { }
