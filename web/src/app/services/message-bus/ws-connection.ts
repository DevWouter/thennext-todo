import { Observable, BehaviorSubject, Subject } from "rxjs";
import { WsEventBasic } from "../ws/events";
import { WsCommandMap } from "../ws/commands";

/**
 * Handles the sending and receiving of messages.
 */
export interface WsConnectionInterface {
  events(): Observable<WsEventBasic>;
  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void;
}

export type WsConnectionState = "closed" | "connecting" | "connected" | "closing";
export type WsConnectionOrigin = "client" | "server";

export interface WsConnectionStatus {
  status: WsConnectionState;
  origin: WsConnectionOrigin;
}

/**
 * Handles the connection control.
 */
export interface WsConnectionControlInterface {
  open(): void;
  close(): void;
  status(): Observable<WsConnectionStatus>;
}

export interface WsConnectionConfig {
  url: string;
}

export class WsConnection implements WsConnectionInterface, WsConnectionControlInterface {
  private socket: WebSocket;
  private readonly _events = new Subject<WsEventBasic>();
  private readonly _status = new BehaviorSubject<WsConnectionStatus>({
    origin: "client",
    status: "closed"
  });

  constructor(
    private readonly config: WsConnectionConfig
  ) { }

  events(): Observable<WsEventBasic> {
    return this._events.asObservable();
  }

  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    if (this.socket === undefined) {
      throw new Error("connection is closed, call `open` first");
    }

    const rawCommand = { command: type, data: data };
    const rawCommandJson = JSON.stringify(rawCommand);
    this.socket.send(rawCommandJson);
  }

  open(): void {
    if (this.socket) {
      throw new Error("connection is already created");
    }

    this.socket = new WebSocket(this.config.url);
    this.socket.addEventListener("open", (ev) => {
      this._status.next({ status: "connected", origin: "client" });
    }, { once: true });

    this.socket.addEventListener("message", (ev) => {
      const event = JSON.parse(ev.data);
      this._events.next(event);
    });

    this.socket.addEventListener("close", (ev) => {
      this.socket = undefined;
      this._status.next({
        status: "closed",
        origin: ev.reason === "client closes" ? "client" : "server"
      });
    });

    this._status.next({ status: "connecting", origin: "client" });
  }

  close(): void {
    if (this.socket === undefined) {
      throw new Error("connection is closed, call `open` first");
    }

    this.socket.close(1000, "client closes");
    this._status.next({ status: "closing", origin: "client" });
    this.socket = undefined;
  }

  status(): Observable<WsConnectionStatus> {
    return this._status.asObservable();
  }
}
