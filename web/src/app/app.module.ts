import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";


import { AppComponent } from "./app.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { AppRoutingModule } from "./app-routing.module";
import { AccountModule } from "./account/account.module";
import { ServicesModule } from "./services/services.module";


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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
