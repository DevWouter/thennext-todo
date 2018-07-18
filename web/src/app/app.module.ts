// tslint:disable:max-line-length

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule as AnimationModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { HtmlDirectivesModule } from "./html-directives/html-directives.module";
import { ServicesModule } from "./services/services.module";

import { SettingsPageModule } from "./settings-page/settings-page.module";

import { AppComponent } from "./app.component";

// Modules
import { DialogsModule } from "./dialogs/dialogs.module";
import { TaskModule } from "./task/task.module";
import { PagesModule } from "./pages/pages.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AnimationModule,
    BrowserModule,
    FormsModule,
    HtmlDirectivesModule,
    SettingsPageModule,
    ServicesModule,
    DialogsModule,
    TaskModule,
    PagesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
