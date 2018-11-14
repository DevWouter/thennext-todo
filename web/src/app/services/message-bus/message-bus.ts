import { Injectable } from "@angular/core";

import { Entity } from "../../models/entity";
import { EntityMessageSenderInterface, EntityMessageSender } from "./entity-message-sender";
import { EntityMessageReceiverInterface, EntityMessageReceiver } from "./entity-message-receiver";
import { EntityRefIdGenerator } from "./entity-refid-generator";
import { WsConnection } from "./ws-connection";
import { environment } from "../../../environments/environment";

type ReviveFunc = (key: any, value: any) => any;

export interface MessageBusInterface {
  createSender<T extends Entity>(entityType: string, reviver: ReviveFunc): EntityMessageSenderInterface<T>;
  createReceiver<T extends Entity>(entityType: string, reviver: ReviveFunc): EntityMessageReceiverInterface<T>;
}

@Injectable()
export class MessageBus implements MessageBusInterface {
  private readonly _connection: WsConnection;

  constructor() {
    this._connection = new WsConnection({ url: environment.wsEndPoint });
  }

  createSender<T extends Entity>(entityType: string, reviver: ReviveFunc): EntityMessageSenderInterface<T> {
    const refIdGenerator = new EntityRefIdGenerator(entityType);
    return new EntityMessageSender<T>(this._connection, refIdGenerator, entityType, reviver);
  }

  createReceiver<T extends Entity>(entityType: string, reviver: ReviveFunc): EntityMessageReceiverInterface<T> {
    return new EntityMessageReceiver<T>(this._connection, entityType, reviver);
  }
}
