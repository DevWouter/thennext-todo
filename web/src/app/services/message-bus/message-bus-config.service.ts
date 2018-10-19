import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";

interface MessageBusConfig {
  active: boolean;
  token: string;
}

@Injectable({
  providedIn: "root"
})
export class MessageBusConfigService {
  private _state: MessageBusConfig = {
    active: false,
    token: null,
  };

  private $state = new BehaviorSubject<MessageBusConfig>(this._state);

  get state(): Observable<MessageBusConfig> {
    return this.$state;
  }

  constructor() { }

  update(state: Partial<MessageBusConfig>): void {
    this._state = { ...this._state, ...state };
    this.$state.next(this._state);
  }
}
