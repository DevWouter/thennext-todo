import { Observable } from "rxjs";
import { WsEventBasic } from "../ws/events";

export interface WsConnectionInterface {
  events(): Observable<WsEventBasic>;
}
