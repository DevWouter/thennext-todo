import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";

// Material module
import { MaterialModule } from '../../material.module';

// External modules
import { DialogsModule } from "../../dialogs/dialogs.module";
import { TasklistModule } from "../../tasklist/tasklist.module";
import { ServicesModule } from "../../services/services.module";

// Internal modules
import { TaskPaneModule } from "./task-pane/task-pane.module";

// Components
import { TaskPageComponent } from "./task-page.component";
import { CommandInputComponent } from "./command-input/command-input.component";
import { TaskPageLeftComponent } from "./task-page-left/task-page-left.component";
import { TaskPageDividerComponent } from "./task-page-divider/task-page-divider.component";
import { GuiModule } from "../../gui/gui.module";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DialogsModule,
    ServicesModule,
    TasklistModule,
    TaskPaneModule,
    GuiModule,
    MaterialModule,
  ],
  declarations: [
    CommandInputComponent,
    TaskPageComponent,
    TaskPageDividerComponent,
    TaskPageLeftComponent,
  ],
  exports: [TaskPageComponent]
})
export class TaskPageModule { }
