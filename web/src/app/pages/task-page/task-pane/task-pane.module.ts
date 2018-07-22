import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// External modules
import { ServicesModule } from "../../../services/services.module";
import { TaskModule } from "../../../task/task.module";

// Main Component
import { TaskPaneComponent } from "./task-pane.component";

// Sub Components
import { TaskPaneRegionComponent } from "./task-pane-region/task-pane-region.component";
import { TaskPaneActionComponent } from "./task-pane-action/task-pane-action.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServicesModule,
    TaskModule,
  ],
  declarations: [
    TaskPaneComponent,
    TaskPaneActionComponent,

    // Never need to be exported
    TaskPaneRegionComponent,
  ],
  exports: [
    TaskPaneComponent,
  ]
})
export class TaskPaneModule { }

