import { NgModule } from '@angular/core';

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
    ...privateModules,
    ...publicModules,
  ],
  exports: [...publicModules],
  providers: [],
})
export class MaterialModule { }
