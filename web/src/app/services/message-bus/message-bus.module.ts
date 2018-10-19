import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBusConfigService } from './message-bus-config.service';

const services = [
  MessageBusConfigService,
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ...services
  ],
})
export class MessageBusModule { }
