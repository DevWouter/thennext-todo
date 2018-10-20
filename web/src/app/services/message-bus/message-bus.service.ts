import { Injectable } from "@angular/core";
import { MessageBusConfigService } from "./message-bus-config.service";
import { Observable, BehaviorSubject } from "rxjs";
import { MessageBusState } from "./message-bus-state";

@Injectable({
  providedIn: "root"
})
export class MessageBusService {
  private _state: MessageBusState = {
    connection: {
      activated: false,
      attempt: 0,
      authenticated: false,
      authenticationRejected: false,
      connected: false,
      connectionRejected: false,
      rejectionMessage: null
    }
  };

  private $state = new BehaviorSubject(this._state);

  get state(): Observable<MessageBusState> {
    return this.$state;
  }

  constructor(
  ) {
  }
}
