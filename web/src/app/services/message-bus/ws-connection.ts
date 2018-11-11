import { Observable } from "rxjs";
import { WsEventBasic } from "../ws/events";
import { WsCommandMap } from "../ws/commands";
import { WebSocketSubject } from "rxjs/webSocket";
import { retry } from "rxjs/operators";

export interface WsConnectionInterface {
  events(): Observable<WsEventBasic>;
  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void
}

export class WsConnection implements WsConnectionInterface {
  constructor(
  ) { }

  events(): Observable<WsEventBasic> {
    throw new Error("Method not implemented.");
  }
  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    throw new Error("Method not implemented.");
  }

}
