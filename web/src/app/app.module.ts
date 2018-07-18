// tslint:disable:max-line-length

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule as AnimationModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AccountModule } from "./account/account.module";
import { HtmlDirectivesModule } from "./html-directives/html-directives.module";
import { AppRoutingModule } from "./app-routing.module";
import { ServicesModule } from "./services/services.module";

import { SettingsPageModule } from "./settings-page/settings-page.module";

import { AppComponent } from "./app.component";

import { CommandInputComponent } from "./command-input/command-input.component";
import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { TaskPageComponent } from "./task-page/task-page.component";
import { TaskPageContentComponent } from "./task-page-content/task-page-content.component";
import { TaskPageContentDividerComponent } from "./task-page-content-divider/task-page-content-divider.component";
import { TaskPageContentListComponent } from "./task-page-content-list/task-page-content-list.component";
import { TaskPageContentListItemComponent } from "./task-page-content-list-item/task-page-content-list-item.component";
import { TaskPageContentPaneComponent } from "./task-page-content-pane/task-page-content-pane.component";
import { TaskPageContentPaneControlComponent } from "./task-page-content-pane-control/task-page-content-pane-control.component";
import { TaskPageHeaderTasklistSelectorComponent } from "./task-page-header-tasklist-selector/task-page-header-tasklist-selector.component";
import { TopnavComponent } from "./topnav/topnav.component";

import { DialogsModule } from "./dialogs/dialogs.module";
import { TaskModule } from "./task/task.module";

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    TaskPageComponent,
    TaskPageContentComponent,
    TaskPageContentDividerComponent,
    TaskPageContentListComponent,
    TaskPageContentPaneComponent,
    TaskPageContentListItemComponent,
    TaskPageContentPaneControlComponent,
    TaskPageHeaderTasklistSelectorComponent,
    CommandInputComponent,
    CreateAccountPageComponent,
    LoginPageComponent,
    TopnavComponent,
  ],
  imports: [
    AnimationModule,
    BrowserModule,
    FormsModule,
    HtmlDirectivesModule,
    SettingsPageModule,
    ServicesModule,
    AppRoutingModule,
    AccountModule,
    DialogsModule,
    TaskModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
