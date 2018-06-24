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
  isEcho: boolean;
  action: "create" | "update" | "delete";
  entityName: "task" | "tasklist" | "checklist" | "relation";
  entity;
}

export class ClientRegisterMessage implements IWebSocketMessage {
  readonly type = WebSocketMessageType.clientRegister;
  readonly token: string;
}
