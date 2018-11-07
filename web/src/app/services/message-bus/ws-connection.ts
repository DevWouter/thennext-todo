import { Observable } from "rxjs";
import { WsEventBasic } from "../ws/events";
import { WsCommandMap } from "../ws/commands";

export interface WsConnectionInterface {
  events(): Observable<WsEventBasic>;
  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void
}
