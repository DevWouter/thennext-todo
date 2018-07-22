import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { ServicesModule } from "../services/services.module";
import { DialogsModule } from "../dialogs/dialogs.module";

import { HomePageComponent } from "./home-page/home-page.component";
import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";

// Routing module
import { PagesRoutingModule } from "./pages-routing.module";
import { TaskPageModule } from "./task-page/task-page.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule, // Required for navigation links
    FormsModule,
    ServicesModule,
    DialogsModule,
    TaskPageModule
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
