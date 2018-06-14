import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WarningModalDialogComponent } from "../warning-modal-dialog/warning-modal-dialog.component";
import { ServicesModule } from "../services/services.module";

@NgModule({
  imports: [
    CommonModule,
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