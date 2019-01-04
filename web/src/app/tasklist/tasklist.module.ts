import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { ServicesModule } from "../services/services.module";

import { TasklistComponent } from "./tasklist.component";
import { TasklistItemComponent } from "./tasklist-item/tasklist-item.component";
import { TasklistSettingsEncryptComponent } from "./tasklist-settings-encrypt/tasklist-settings-encrypt.component";
import { TasklistSettingsEncryptPanelComponent } from "./tasklist-settings-encrypt-panel/tasklist-settings-encrypt-panel.component";

const publicComponents = [
  TasklistComponent,
  TasklistSettingsEncryptComponent,
];

const privateComponents = [
  TasklistItemComponent,
  TasklistSettingsEncryptPanelComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ServicesModule,
  ],
  declarations: [
    ...publicComponents,
    ...privateComponents,
  ],
  exports: [
    ...publicComponents,
  ]
})
export class TasklistModule { }
