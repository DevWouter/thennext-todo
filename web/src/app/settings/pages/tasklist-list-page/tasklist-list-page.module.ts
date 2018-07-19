import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
// External modules
import { SettingsSharedModule } from "../../shared/settings-shared.module";

// Main component
import { TasklistListPageComponent } from "./tasklist-list-page.component";


// Sub component
import { SettingsPageTasklistItemComponent } from "./tasklist-item/tasklist-item.component";
import { SettingsCreateTasklistComponent } from "./create-tasklist/settings-page-tasklist-creator.component";
import { AcceptShareTokenComponent } from "./accept-share-token/accept-share-token.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SettingsSharedModule,
  ],
  declarations: [
    AcceptShareTokenComponent,
    SettingsPageTasklistItemComponent,
    SettingsCreateTasklistComponent,
    TasklistListPageComponent,
  ],
  exports: [
    TasklistListPageComponent,
  ]
})
export class SettingsTasklistListPageModule { }
