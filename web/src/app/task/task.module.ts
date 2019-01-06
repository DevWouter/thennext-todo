import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// Our modules
import { ServicesModule } from "../services/services.module";
import { HtmlDirectivesModule } from "../html-directives/html-directives.module";

// Our components
import { ChecklistComponent } from "./checklist/checklist.component";
import { ChecklistItemComponent } from "./checklist-item/checklist-item.component";
import { DescriptionInputComponent } from "./description-input/description-input.component";
import { DurationInputComponent } from "./duration-input/duration-input.component";
import { RelationsViewComponent } from "./relations-view/relations-view.component";
import { StatsViewComponent } from "./stats-view/stats-view.component";
import { TitleInputComponent } from "./title-input/title-input.component";
import { MaterialModule } from '../material.module';


const publicComponents = [
  ChecklistComponent,
  DescriptionInputComponent,
  DurationInputComponent,
  RelationsViewComponent,
  StatsViewComponent,
  TitleInputComponent,
];

const privateComponents = [
  ChecklistItemComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MaterialModule,

    ServicesModule,
    HtmlDirectivesModule,
  ],
  declarations: [
    ...publicComponents,
    ...privateComponents,
  ],
  exports: [
    ...publicComponents,
  ]
})
export class TaskModule { }
