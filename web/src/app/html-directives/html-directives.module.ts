import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextareaResizeDirective } from "./textarea-resize.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TextareaResizeDirective
  ],
  exports: [
    TextareaResizeDirective
  ]
})
export class HtmlDirectivesModule { }
