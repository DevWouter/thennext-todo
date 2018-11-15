import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageBusService } from "./message-bus.service";
import { MessageBusStateService } from "./message-bus-state.service";


const services = [
  MessageBusService,
  MessageBusStateService,
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
