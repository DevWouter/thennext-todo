import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

// External modules
import { SettingsSharedModule } from "../../shared/settings-shared.module";

// Main component
import { TasklistDetailPageComponent } from "./tasklist-detail-page.component";

// Internal components

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SettingsSharedModule,

  ],
  declarations: [
    TasklistDetailPageComponent,
  ],
  exports: [
    TasklistDetailPageComponent,
  ]
})
export class SettingsTasklistDetailPageModule { }
