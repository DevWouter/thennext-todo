import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { ServicesModule } from "../services/services.module";

import { TasklistComponent } from "./tasklist.component";
import { TasklistItemComponent } from "./tasklist-item/tasklist-item.component";

const publicComponents = [
  TasklistComponent,
];

const privateComponents = [
  TasklistItemComponent,
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
