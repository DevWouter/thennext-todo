import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TaskPageComponent } from "./task-page.component";
import { DialogsModule } from "../../dialogs/dialogs.module";
import { TaskPageMenuComponent } from "./task-page-menu/task-page-menu.component";
import { TasklistModule } from "../../tasklist/tasklist.module";
import { ServicesModule } from "../../services/services.module";
import { TaskPageContentDividerComponent } from "./task-page-content-divider/task-page-content-divider.component";
import { TaskPaneModule } from "./task-pane/task-pane.module";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DialogsModule,
    ServicesModule,
    TasklistModule,
    TaskPaneModule
  ],
  declarations: [
    TaskPageComponent,
    TaskPageMenuComponent,
    TaskPageContentDividerComponent,
  ],
  exports: [TaskPageComponent]
})
export class TaskPageModule { }
