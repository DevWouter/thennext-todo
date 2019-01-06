import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import {
  MatButtonModule,
  MatCommonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';


const publicModules = [
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule,
];

const privateModules = [
  MatCommonModule
];

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    ...privateModules,
    ...publicModules,
  ],
  exports: [...publicModules],
  providers: [],
})
export class MaterialModule { }
