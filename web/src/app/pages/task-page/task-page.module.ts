import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Material module
import { MaterialModule } from '../../material.module';

// External modules
import { DialogsModule } from "../../dialogs/dialogs.module";
import { TasklistModule } from "../../tasklist/tasklist.module";
import { ServicesModule } from "../../services/services.module";
import { GuiModule } from "../../gui/gui.module";

// Internal modules
import { TaskPaneModule } from "./task-pane/task-pane.module";

// Components
import { CommandInputComponent } from "./command-input/command-input.component";
import { TaskPageComponent } from "./task-page.component";
import { TaskPageDividerComponent } from "./task-page-divider/task-page-divider.component";
import { TaskPageHeaderComponent } from './task-page-header/task-page-header.component';
import { TaskPageLeftComponent } from "./task-page-left/task-page-left.component";
import { TaskPageMenuComponent } from './task-page-menu/task-page-menu.component';

const publicComponents = [
  TaskPageComponent,
];

const privateComponents = [
  CommandInputComponent,
  TaskPageComponent,
  TaskPageDividerComponent,
  TaskPageHeaderComponent,
  TaskPageLeftComponent,
  TaskPageMenuComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DialogsModule,
    ServicesModule,
    TasklistModule,
    TaskPaneModule,
    GuiModule,
    MaterialModule,
  ],
  declarations: [
    ...publicComponents,
    ...privateComponents,
  ],
  exports: [...publicComponents]
})
export class TaskPageModule { }
