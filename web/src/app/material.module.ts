import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatCommonModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';


const publicModules = [
  MatToolbarModule,
  MatSidenavModule,
];

const privateModules = [
  MatCommonModule
];

@NgModule({
  declarations: [],
  imports: [
    ...privateModules,
    ...publicModules,
  ],
  exports: [...publicModules],
  providers: [],
})
export class MaterialModule { }
