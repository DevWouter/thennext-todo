import { Injectable } from "@angular/core";
import { MessageBusConfigService } from "./message-bus-config.service";
import { Observable, BehaviorSubject } from "rxjs";
import { MessageBusState, MessageBusStateConnection } from "./message-bus-state";
import { WsConnection, WsConnectionCallbacks } from "./ws-connection";
import { WsEventBasic, WsEvent } from "../ws/events";
import { combineLatest } from "rxjs";
import { filter } from "rxjs/operators";
import { WsCommandMap } from "../ws/commands";

@Injectable({
  providedIn: "root"
})
export class MessageBusService {
  callbacks: WsConnectionCallbacks;

  private _state: MessageBusState = {
    connection: {
      activated: false,
      authenticated: false,
      connected: false,
      error: null,
    }
  };

  private $state = new BehaviorSubject(this._state);

  get state(): Observable<MessageBusState> {
    return this.$state;
  }

  constructor(
    private readonly messageBusConfigService: MessageBusConfigService,
    private readonly wsConnection: WsConnection,
  ) {
    this.setup();
  }

  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    if (type === "set-token") {
      throw new Error("The messagebus performs set-token internal");
    }

    if (!this._state.connection.authenticated) {
      throw new Error("The messagebus is not authenticated");
    }

    const rawCommand = { command: type, data: data };
    const rawCommandJson = JSON.stringify(rawCommand);
    this.wsConnection.send(rawCommandJson);
  }

  private setup() {
    // Setup own callbacks.
    this.callbacks = {
      connected: () => {
        this.updateState({ connected: true });
      },
      disconnected: () => {
        this.updateState({ connected: false });
        this.ensureConnection();
      },
      connectionFailed: () => {
        this.updateState({ connected: false, error: { cause: "connection" } });
      },
      received: (data) => { this.onDataStringReceived(data); },
    };

    // Listen to the configuration.
    this.messageBusConfigService.state.subscribe(state => {
      if (state.active && !this._state.connection.activated) {
        this.connect();
        this.updateState({ activated: true });
      }
      if (!state.active && this._state.connection.activated) {
        this.wsConnection.close();
        this.updateState({ activated: false });
      }
    });

    combineLatest(this.messageBusConfigService.state, this.state)
      .pipe(
        filter(([config, state]) => config.active && config.token && state.connection.connected && !state.connection.authenticated)
      ).subscribe(([config, state]) => {
        this.sendAuth(config.token);
      });
  }

  private connect() {
    this.wsConnection.open(this.callbacks);
  }

  private sendAuth(token: string) {
    this.sendDirect("set-token", { token: token });
  }

  private sendDirect<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    const rawCommand = { command: type, data: data };
    const rawCommandJson = JSON.stringify(rawCommand);
    this.wsConnection.send(rawCommandJson);
  }

  private ensureConnection() {
    if (this._state.connection.activated && !this._state.connection.connected) {
      this.connect();
    }
  }

  private onDataStringReceived(data: string): void {
    // Should be a json object.
    var object = JSON.parse(data) as WsEventBasic;
    this.onEvent(object);
  }

  private onEvent(data: WsEventBasic): void {
    if (data.type === "token-accepted") {
      this.updateState({ authenticated: true });
    }
    if (data.type === "token-rejected") {
      var message = data as WsEvent<"token-rejected">;
      this.updateState({
        activated: false,
        authenticated: false,
        error: { cause: "auth", reason: message.data.reason }
      });
    }
  }

  private updateState(newState: Partial<MessageBusStateConnection>) {
    this._state = { connection: { ...this._state.connection, ...newState } };
    this.$state.next(this._state);
  }
}
