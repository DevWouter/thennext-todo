import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

const services = [
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
