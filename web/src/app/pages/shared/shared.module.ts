import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MaterialModule } from '../../material.module';

import { CommonPageHeaderComponent } from "./common-page-header/common-page-header.component";
import { CommonPageFooterComponent } from "./common-page-footer/common-page-footer.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MaterialModule,
  ],
  declarations: [
    CommonPageHeaderComponent,
    CommonPageFooterComponent,
  ],
  exports: [
    CommonPageHeaderComponent,
    CommonPageFooterComponent,
  ],
  providers: [],
})
export class SharedPagesModule { }
