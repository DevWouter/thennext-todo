import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ServicesModule } from "../services/services.module";

import { ChecklistComponent } from "./checklist/checklist.component";
import { ChecklistItemComponent } from "./checklist-item/checklist-item.component";
import { DescriptionInputComponent } from "./description-input/description-input.component";
import { RelationsViewComponent } from "./relations-view/relations-view.component";
import { StatsViewComponent } from "./stats-view/stats-view.component";
import { TitleInputComponent } from "./title-input/title-input.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServicesModule,
  ],
  declarations: [
    ChecklistComponent,
    DescriptionInputComponent,
    RelationsViewComponent,
    StatsViewComponent,
    TitleInputComponent,

    // Never need to be exported
    ChecklistItemComponent
  ],
  exports: [
    ChecklistComponent,
    DescriptionInputComponent,
    RelationsViewComponent,
    StatsViewComponent,
    TitleInputComponent,
  ]
})
export class TaskModule { }
