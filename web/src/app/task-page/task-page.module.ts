import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TaskPageComponent } from "./task-page.component";
import { TaskPageContentComponent } from "./task-page-content/task-page-content.component";
import { TaskPageContentDividerComponent } from "./task-page-content-divider/task-page-content-divider.component";
import { TaskPageContentListComponent } from "./task-page-content-list/task-page-content-list.component";
import { TaskPageContentPaneComponent } from "./task-page-content-pane/task-page-content-pane.component";
import { TaskPageFooterComponent } from "./task-page-footer/task-page-footer.component";
import { TaskPageHeaderComponent } from "./task-page-header/task-page-header.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TaskPageComponent,
    TaskPageContentComponent,
    TaskPageContentDividerComponent,
    TaskPageContentListComponent,
    TaskPageContentPaneComponent,
    TaskPageFooterComponent,
    TaskPageHeaderComponent,
  ],
})
export class TaskPageModule { }
