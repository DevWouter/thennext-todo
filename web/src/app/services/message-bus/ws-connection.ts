import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

export interface WsConnectionCallbacks {
  received(data: string): void;
  connectionFailed(): void;
  connected(): void;
  disconnected(): void;
}

@Injectable()
export class WsConnection {
  private _ws: WebSocket = undefined;

  open(callbacks: WsConnectionCallbacks) {
    if (this._ws) {
      throw new Error("WebSocket was already opened");
    }

    function onOpen(ev: Event) { callbacks.connected(); }
    function onMessage(ev: MessageEvent) { callbacks.received(ev.data); }
    function onClose(ev: CloseEvent) { callbacks.disconnected(); }
    function onError(ev: Event) { callbacks.connectionFailed(); }

    this._ws = new WebSocket(environment.wsEndPoint);
    this._ws.addEventListener("open", onOpen);
    this._ws.addEventListener("message", onMessage);
    this._ws.addEventListener("close", onClose);
    this._ws.addEventListener("error", onError);
  }

  close(): void {
    if (!this._ws) {
      throw new Error("WebSocket wasn't initialized");
    }

    this._ws.close();
    this._ws = undefined;
  }

  send(data: string): void {
    if (!this._ws) {
      throw new Error("WebSocket wasn't initialized");
    }

    this._ws.send(data);
  }
}
