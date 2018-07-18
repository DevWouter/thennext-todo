import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TaskPaneComponent } from "./task-pane.component";
import { TaskPaneRegionComponent } from "./task-pane-region/task-pane-region.component";
import { ServicesModule } from "../../../services/services.module";
import { TaskModule } from "../../../task/task.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServicesModule,
    TaskModule,
  ],
  declarations: [
    TaskPaneComponent,

    // Never need to be exported
    TaskPaneRegionComponent,
  ],
  exports: [
    TaskPaneComponent,
  ]
})
export class TaskPaneModule { }

