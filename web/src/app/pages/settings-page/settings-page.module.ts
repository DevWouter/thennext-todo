import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DialogsModule } from "../../dialogs/dialogs.module";
import { GuiModule } from "../../gui/gui.module";

import { SettingsPageComponent } from "./settings-page.component";
import { SettingsPageMenuComponent } from "./settings-page-menu/settings-page-menu.component";
import { SettingsPageRoutingModule } from "./settings-page.routing";
import { SettingsTasklistsComponent } from "./tab-tasklists/tab-tasklists.component";
import { SettingsTabTagsComponent } from "./tab-tags/tab-tags.component";
import { SettingsTabUrgencyComponent } from "./tab-urgency/tab-urgency.component";
import { SettingsTasklistDetailComponent } from "./tab-tasklists-detail/tab-tasklist-detail.component";
import { SettingsTabTitleComponent } from "./settings-tab-title/settings-tab-title.component";
import { SettingsTabPersonalComponent } from "./tab-personal/tab-personal.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SettingsPageRoutingModule,
    DialogsModule,
    GuiModule,
  ],
  declarations: [
    SettingsPageComponent,

    SettingsPageMenuComponent,
    SettingsTabTitleComponent,

    SettingsTasklistsComponent,
    SettingsTabTagsComponent,
    SettingsTabUrgencyComponent,
    SettingsTasklistDetailComponent,
    SettingsTabPersonalComponent,
  ],
  exports: [
  ],
  providers: [],
})
export class SettingsPageModule { }
