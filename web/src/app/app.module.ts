import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AccountModule } from "./account/account.module";
import { ServicesModule } from "./services/services.module";

import { AppComponent } from "./app.component";

import { HomepageComponent } from "./homepage/homepage.component";
import { TaskPageComponent } from "./task-page/task-page.component";
import { TaskPageHeaderComponent } from "./task-page-header/task-page-header.component";
import { TaskPageFooterComponent } from "./task-page-footer/task-page-footer.component";
import { TaskPageContentComponent } from "./task-page-content/task-page-content.component";

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    TaskPageComponent,
    TaskPageHeaderComponent,
    TaskPageFooterComponent,
    TaskPageContentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ServicesModule,
    AppRoutingModule,
    AccountModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
