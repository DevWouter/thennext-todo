import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatCommonModule,
  MatIconModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';


const publicModules = [
  MatIconModule,
  MatToolbarModule,
  MatSidenavModule,
  MatButtonModule,
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
