import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { MessageBusConfig } from "./message-bus-config";

@Injectable({
  providedIn: "root"
})
export class MessageBusConfigService {
  private _state: MessageBusConfig;

  private $state: BehaviorSubject<MessageBusConfig>;

  get state(): Observable<MessageBusConfig> {
    return this.$state;
  }

  constructor() {
    this._state = {
      active: false,
      token: null,
    };

    this.$state = new BehaviorSubject(this._state);
  }

  update(state: Partial<MessageBusConfig>): void {
    this._state = { ...this._state, ...state };
    this.$state.next(this._state);
  }
}
