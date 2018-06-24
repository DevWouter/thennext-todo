import { Injectable, OnDestroy } from "@angular/core";
import { Observable, BehaviorSubject, Subject, combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";
import {
  WebSocketMessageType,
  ClientRegisterMessage,
  EntityWebSocketMessage,
} from "./models/ws-messages/web-socket-message.interface";
import { ApiService } from "./api.service";

type WebSocketStatus = "unknown" | "error" | "online" | "offline";

export interface IWebSocketMessage {
  type: string;
}

@Injectable()
export class WebSocketService implements OnDestroy {
  private _message = new Subject<IWebSocketMessage>();


  private _status = new BehaviorSubject<WebSocketStatus>("unknown");
  get status(): Observable<WebSocketStatus> { return this._status; }

  private $allEntityMessages: Observable<EntityWebSocketMessage>;
  private $extEntityMessage: Observable<EntityWebSocketMessage>;
  $taskMessage: Observable<EntityWebSocketMessage>;

  private _ws: WebSocket;

  constructor(
    private apiService: ApiService,
  ) {
    this.$allEntityMessages = this._message
      .pipe(
        filter(x => !!x),
        filter(x => x.type === WebSocketMessageType.entity),
        map(x => x as EntityWebSocketMessage)
      );
    this.$extEntityMessage = this.$allEntityMessages.pipe(filter(x => x.isEcho === false));

    this.$taskMessage = this.$extEntityMessage.pipe(filter(x => x.entityName === "task"));

    const clientRegisterRequestMessage = this._message
      .pipe(
        filter(x => x.type === WebSocketMessageType.ClientRegisterRequest)
      );
    const sendToken = combineLatest(clientRegisterRequestMessage, this.apiService.sessionToken);
    sendToken
      .pipe(map(x => x[1]))
      .subscribe(x => {
        this.sendMessage(new ClientRegisterMessage(x));
      });

    this._ws = new WebSocket("ws://" + window.location.host + "/api");
    this._ws.addEventListener("message", async (event) => {
      try {
        if (!event.data) {
          throw new Error("Received empty message");
        }
        const message = JSON.parse(event.data) as IWebSocketMessage;
        if (!message.type) {
          throw new Error("The message doesn't contain a type-parameter: " + event.data);
        }

        this._message.next(message);

      } catch (reason) {
        console.error(reason);
        this._status.next("error");
      }
    });

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
  }

  private sendMessage(message: IWebSocketMessage) {
    const msg_json = JSON.stringify(message);

    console.log("Sending", msg_json);
    this._ws.send(msg_json);
  }

  ngOnDestroy(): void {
    this._ws.close();
  }
}
