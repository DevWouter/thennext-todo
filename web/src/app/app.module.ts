// tslint:disable:max-line-length
import "./shared/shared";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule as AnimationModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AccountModule } from "./account/account.module";
import { AppRoutingModule } from "./app-routing.module";
import { ServicesModule } from "./services/services.module";

import { AppComponent } from "./app.component";

import { HomepageComponent } from "./homepage/homepage.component";
import { TaskPageComponent } from "./task-page/task-page.component";
import { TaskPageContentComponent } from "./task-page-content/task-page-content.component";
import { TaskPageContentDividerComponent } from "./task-page-content-divider/task-page-content-divider.component";
import { TaskPageContentListComponent } from "./task-page-content-list/task-page-content-list.component";
import { TaskPageContentPaneComponent } from "./task-page-content-pane/task-page-content-pane.component";
import { TaskPageFooterComponent } from "./task-page-footer/task-page-footer.component";
import { TaskPageHeaderComponent } from "./task-page-header/task-page-header.component";
import { TaskPageContentListItemComponent } from "./task-page-content-list-item/task-page-content-list-item.component";
import { TaskPageContentPaneTitleComponent } from "./task-page-content-pane-title/task-page-content-pane-title.component";
import { TaskPageContentPaneStatsComponent } from "./task-page-content-pane-stats/task-page-content-pane-stats.component";
import { TaskPageContentPaneDescriptionComponent } from "./task-page-content-pane-description/task-page-content-pane-description.component";
import { TaskPageContentPaneChecklistComponent } from "./task-page-content-pane-checklist/task-page-content-pane-checklist.component";
import { TaskPageContentPaneRelationsComponent } from "./task-page-content-pane-relations/task-page-content-pane-relations.component";
import { TaskPageContentPaneControlComponent } from "./task-page-content-pane-control/task-page-content-pane-control.component";
import { TaskPageHeaderFilterMenuComponent } from "./task-page-header-filter-menu/task-page-header-filter-menu.component";
import { TaskPageFooterInputComponent } from "./task-page-footer-input/task-page-footer-input.component";
import { SettingsPageComponent } from "./settings-page/settings-page.component";
import { SettingsPageTasklistsComponent } from "./settings-page-tasklists/settings-page-tasklists.component";
import { TaskPageHeaderTasklistSelectorComponent } from "./task-page-header-tasklist-selector/task-page-header-tasklist-selector.component";
import { TaskPageContentPaneChecklistItemComponent } from "./task-page-content-pane-checklist-item/task-page-content-pane-checklist-item.component";
import { SettingsPageHeaderComponent } from "./settings-page-header/settings-page-header.component";
import { SettingsPageTabScoringComponent } from "./settings-page-tab-scoring/settings-page-tab-scoring.component";
import { SettingsPageTabTasklistsComponent } from "./settings-page-tab-tasklists/settings-page-tab-tasklists.component";
import { SettingsPageScoreshiftsComponent } from "./settings-page-scoreshifts/settings-page-scoreshifts.component";
import { TaskPageHeaderSearchComponent } from "./task-page-header-search/task-page-header-search.component";

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    TaskPageComponent,
    TaskPageContentComponent,
    TaskPageContentDividerComponent,
    TaskPageContentListComponent,
    TaskPageContentPaneComponent,
    TaskPageFooterComponent,
    TaskPageHeaderComponent,
    TaskPageContentListItemComponent,
    TaskPageContentPaneTitleComponent,
    TaskPageContentPaneStatsComponent,
    TaskPageContentPaneDescriptionComponent,
    TaskPageContentPaneChecklistComponent,
    TaskPageContentPaneRelationsComponent,
    TaskPageContentPaneControlComponent,
    TaskPageHeaderFilterMenuComponent,
    TaskPageFooterInputComponent,
    SettingsPageComponent,
    SettingsPageTasklistsComponent,
    TaskPageHeaderTasklistSelectorComponent,
    TaskPageContentPaneChecklistItemComponent,
    SettingsPageHeaderComponent,
    SettingsPageTabScoringComponent,
    SettingsPageTabTasklistsComponent,
    SettingsPageScoreshiftsComponent,
    TaskPageHeaderSearchComponent,
  ],
  imports: [
    AnimationModule,
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
