// tslint:disable:max-line-length

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule as AnimationModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AccountModule } from "./account/account.module";
import { HtmlDirectivesModule } from "./html-directives/html-directives.module";
import { AppRoutingModule } from "./app-routing.module";
import { ServicesModule } from "./services/services.module";

import { AppComponent } from "./app.component";

import { HomepageComponent } from "./homepage/homepage.component";
import { TaskPageComponent } from "./task-page/task-page.component";
import { TaskPageContentComponent } from "./task-page-content/task-page-content.component";
import { TaskPageContentDividerComponent } from "./task-page-content-divider/task-page-content-divider.component";
import { TaskPageContentListComponent } from "./task-page-content-list/task-page-content-list.component";
import { TaskPageContentPaneComponent } from "./task-page-content-pane/task-page-content-pane.component";
import { TaskPageContentListItemComponent } from "./task-page-content-list-item/task-page-content-list-item.component";
import { TaskPageContentPaneTitleComponent } from "./task-page-content-pane-title/task-page-content-pane-title.component";
import { TaskPageContentPaneStatsComponent } from "./task-page-content-pane-stats/task-page-content-pane-stats.component";
import { TaskPageContentPaneDescriptionComponent } from "./task-page-content-pane-description/task-page-content-pane-description.component";
import { TaskPageContentPaneChecklistComponent } from "./task-page-content-pane-checklist/task-page-content-pane-checklist.component";
import { TaskPageContentPaneRelationsComponent } from "./task-page-content-pane-relations/task-page-content-pane-relations.component";
import { TaskPageContentPaneControlComponent } from "./task-page-content-pane-control/task-page-content-pane-control.component";
import { SettingsPageComponent } from "./settings-page/settings-page.component";
import { SettingsPageTasklistsComponent } from "./settings-page-tasklists/settings-page-tasklists.component";
import { TaskPageHeaderTasklistSelectorComponent } from "./task-page-header-tasklist-selector/task-page-header-tasklist-selector.component";
import { TaskPageContentPaneChecklistItemComponent } from "./task-page-content-pane-checklist-item/task-page-content-pane-checklist-item.component";
import { SettingsPageHeaderComponent } from "./settings-page-header/settings-page-header.component";
import { SettingsPageTabScoringComponent } from "./settings-page-tab-scoring/settings-page-tab-scoring.component";
import { SettingsPageTabTasklistsComponent } from "./settings-page-tab-tasklists/settings-page-tab-tasklists.component";
import { SettingsPageScoreshiftsComponent } from "./settings-page-scoreshifts/settings-page-scoreshifts.component";
import { CommandInputComponent } from "./command-input/command-input.component";
import { CreateAccountPageComponent } from "./create-account-page/create-account-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { TopnavComponent } from "./topnav/topnav.component";

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
    TaskPageContentPaneTitleComponent,
    TaskPageContentPaneStatsComponent,
    TaskPageContentPaneDescriptionComponent,
    TaskPageContentPaneChecklistComponent,
    TaskPageContentPaneRelationsComponent,
    TaskPageContentPaneControlComponent,
    SettingsPageComponent,
    SettingsPageTasklistsComponent,
    TaskPageHeaderTasklistSelectorComponent,
    TaskPageContentPaneChecklistItemComponent,
    SettingsPageHeaderComponent,
    SettingsPageTabScoringComponent,
    SettingsPageTabTasklistsComponent,
    SettingsPageScoreshiftsComponent,
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
    ServicesModule,
    AppRoutingModule,
    AccountModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
