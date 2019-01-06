// tslint:disable:max-line-length

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCommonModule } from '@angular/material';

import { ServicesModule } from "./services/services.module";


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
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatCommonModule,

    ServicesModule,
    DialogsModule,
    TaskModule,
    PagesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
