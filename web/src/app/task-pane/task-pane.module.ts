import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ServicesModule } from "../services/services.module";
import { TaskPaneComponent } from "./task-pane.component";
import { TaskPaneRegionComponent } from "./task-pane-region/task-pane-region.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServicesModule,
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
export class TaskModule { }
