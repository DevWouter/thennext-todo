import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePageComponent } from './schedule-page.component';

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
  imports: [CommonModule],
  exports: [
    ...publicComponents,
  ],
  providers: [],
})
export class SchedulePageModule { }
