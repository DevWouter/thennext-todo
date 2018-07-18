import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { ServicesModule } from "../services/services.module";

import { TasklistComponent } from "./tasklist.component";
import { TasklistItemComponent } from "./tasklist-item/tasklist-item.component";
import { CommandInputComponent } from "./command-input/command-input.component";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ServicesModule,
  ],
  declarations: [
    TasklistComponent,

    CommandInputComponent,
    TasklistItemComponent,
  ],
  exports: [TasklistComponent]
})
export class TasklistModule { }
