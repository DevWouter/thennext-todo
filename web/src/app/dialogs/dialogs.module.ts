import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { WarningModalDialogComponent } from "../warning-modal-dialog/warning-modal-dialog.component";
import { ServicesModule } from "../services/services.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ServicesModule,
  ],
  declarations: [
    WarningModalDialogComponent,
  ],
  exports: [
    WarningModalDialogComponent,
  ]
})
export class DialogsModule { }
