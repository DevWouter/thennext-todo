export enum WebSocketMessageType {
  entity = "entity",
  ClientRegisterRequest = "client-registration-request",
  clientRegister = "client-register",
}

export interface IWebSocketMessage {
  readonly type: WebSocketMessageType;
}

export class EntityWebSocketMessage implements IWebSocketMessage {
  readonly type = WebSocketMessageType.entity;

  /**
   * Was it send back to the origin?
   */
  readonly isEcho: boolean;
  readonly action: "create" | "update" | "delete";
  readonly entityName: "task" | "tasklist" | "checklist" | "relation";
  readonly entity;
}

export class ClientRegisterMessage implements IWebSocketMessage {
  readonly type = WebSocketMessageType.clientRegister;
  constructor(readonly token: string) { }
}
