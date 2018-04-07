import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AccountModule } from "./account/account.module";
import { ServicesModule } from "./services/services.module";

import { AppComponent } from "./app.component";

import { HomepageComponent } from "./homepage/homepage.component";
import { TaskPageComponent } from "./task-page/task-page.component";
import { TaskPageModule } from "./task-page/task-page.module";

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServicesModule,
    AppRoutingModule,
    AccountModule,
    TaskPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
