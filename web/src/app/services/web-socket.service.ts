import { Injectable, OnDestroy } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";

type WebSocketStatus = "unknown" | "error" | "online" | "offline";

export interface IWebSocketMessage {
  type: string;
}

@Injectable()
export class WebSocketService implements OnDestroy {
  private _lastMessage = new BehaviorSubject<IWebSocketMessage>(undefined);
  private _status = new BehaviorSubject<WebSocketStatus>("unknown");

  get status(): Observable<WebSocketStatus> { return this._status; }
  get lastMessage(): Observable<IWebSocketMessage> {
    return this._lastMessage.pipe(filter(x => !!x));
  }

  private _ws: WebSocket;

  constructor(
  ) {
    this._ws = new WebSocket("ws://" + window.location.host + "/api");
    this._ws.addEventListener("close", (ev) => {
      console.log(ev);
      if (ev.wasClean) {
        this._status.next("offline");
      } else {
        this._status.next("error");
      }
    });
    this._ws.addEventListener("error", (ev) => {
      console.error(ev);
      this._status.next("error");
    });

    this._ws.addEventListener("open",
      (ev) => {
        console.log(ev);
        this._status.next("online");
      });

    this._ws.addEventListener("message", (event) => {
      try {
        if (!event.data) {
          throw new Error("Received empty message");
        }
        const message = JSON.parse(event.data) as IWebSocketMessage;
        if (!message.type) {
          throw new Error("The message doesn't contain a type-parameter: " + event.data);
        }

        this._lastMessage.next(message);

      } catch (reason) {
        console.error(reason);
        this._status.next("error");
      }
    });
  }

  ngOnDestroy(): void {
    this._ws.close();
  }
}
