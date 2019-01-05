import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MessageBusService } from "./message-bus.service";
import { MessageBusStateService } from "./message-bus-state.service";
import { RepositoryFactoryService } from "./respository-factory.service";


const services = [
  MessageBusService,
  MessageBusStateService,
  RepositoryFactoryService,
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
