import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

// External modules
import { DialogsModule } from "../../dialogs/dialogs.module";

// Components
import { TabTitlesComponent } from "./tab-titles/tab-titles.component";
import { PageHeaderComponent } from "./page-header/page-header.component";
import { SettingsPageTitleComponent } from "./settings-page-title/settings-page-title.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DialogsModule,
  ],
  declarations: [
    TabTitlesComponent,
    PageHeaderComponent,
    SettingsPageTitleComponent
  ],
  exports: [
    TabTitlesComponent,
    PageHeaderComponent,
    SettingsPageTitleComponent
  ]
})
export class SettingsSharedModule { }
