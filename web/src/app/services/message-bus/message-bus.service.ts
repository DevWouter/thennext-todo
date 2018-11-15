import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";

import { Entity } from "../../models/entity";
import { EntityMessageSenderInterface, EntityMessageSender } from "./entity-message-sender";
import { EntityMessageReceiverInterface, EntityMessageReceiver } from "./entity-message-receiver";
import { EntityRefIdGenerator } from "./entity-refid-generator";
import { WsConnection, WsConnectionState } from "./ws-connection";
import { environment } from "../../../environments/environment";
import { filter, map } from "rxjs/operators";
import { TokenService } from "../token.service";
import { WsEventMap, WsEventBasic, WsEvent } from "../ws/events";
import { WsCommandMap } from "../ws/commands";

type ReviveFunc = (key: any, value: any) => any;

function WhenEvent<K extends keyof WsEventMap>(eventType: K) {
  return (source: Observable<WsEventBasic>) => {
    return source.pipe(
      filter(x => x.echo),
      filter(x => x.type === eventType),
      map(x => x as WsEvent<K>),
    )
  };
};

export interface MessageBusStatus {
  status: WsConnectionState | "accepted" | "rejected";
  origin: "client" | "server";
}

export interface MessageBusInterface {
  createSender<T extends Entity>(entityType: string, reviver: ReviveFunc): EntityMessageSenderInterface<T>;
  createReceiver<T extends Entity>(entityType: string, reviver: ReviveFunc): EntityMessageReceiverInterface<T>;
}

@Injectable()
export class MessageBusService implements MessageBusInterface {
  private readonly _connection: WsConnection = new WsConnection({ url: environment.wsEndPoint });
  private readonly $connectionStatus = this._connection.status();
  private readonly $connectionEvents = this._connection.events();
  private readonly _status = new BehaviorSubject<MessageBusStatus>({
    origin: "client",
    status: "closed"
  });

  public readonly status = this._status.asObservable();

  constructor(tokenService: TokenService) {
    // Always forward the connection status.
    this.$connectionStatus.subscribe(status => {
      this._status.next({
        status: status.status,
        origin: status.origin,
      });
    });

    // If connected send the token.
    combineLatest(this.$connectionStatus, tokenService.token)
      .pipe(filter(([status]) => status.status === "connected"))
      .subscribe(([_, token]) => {
        this._connection.send("set-token", { token: token });
      });

    this.$connectionEvents.pipe(WhenEvent("token-accepted"))
      .subscribe(x => {
        this._status.next({
          status: "accepted",
          origin: "server",
        });
      });

    this.$connectionEvents.pipe(WhenEvent("token-rejected"))
      .subscribe(x => {
        this._status.next({
          status: "rejected",
          origin: "server",
        });
      });
  }

  eventsOf<K extends keyof WsEventMap>(type: K): Observable<WsEvent<K>> {
    return this.$connectionEvents
      .pipe(WhenEvent(type));
  }

  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    this._connection.send(type, data);
  }

  createSender<T extends Entity>(entityType: string, reviver: ReviveFunc): EntityMessageSenderInterface<T> {
    const refIdGenerator = new EntityRefIdGenerator(entityType);
    return new EntityMessageSender<T>(this._connection, refIdGenerator, entityType, reviver);
  }

  createReceiver<T extends Entity>(entityType: string, reviver: ReviveFunc): EntityMessageReceiverInterface<T> {
    return new EntityMessageReceiver<T>(this._connection, entityType, reviver);
  }

  connect() {
    this._connection.open();
  }

  disconnect(): any {
    this._connection.close();
  }
}
