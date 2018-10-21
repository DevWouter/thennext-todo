import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageBusConfigService } from "./message-bus-config.service";
import { MessageBusService } from "./message-bus.service";

const services = [
  MessageBusConfigService,
  MessageBusService,
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
