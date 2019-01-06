import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePageComponent } from './schedule-page.component';
import { MaterialModule } from '../../material.module';
import { RouterModule } from '@angular/router';

const publicComponents = [
  SchedulePageComponent,
];

const privateComponents = [
];

@NgModule({
  declarations: [
    ...publicComponents,
    ...privateComponents,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
  ],
  exports: [
    ...publicComponents,
  ],
  providers: [],
})
export class SchedulePageModule { }
