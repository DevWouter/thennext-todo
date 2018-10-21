import { Injectable } from "@angular/core";

export interface WsConnectionCallbacks {
  received(data: string): void;
  connectionFailed(): void;
  connected(): void;
  disconnected(): void;
}

@Injectable()
export class WsConnection {
  open(callbacks: WsConnectionCallbacks) {
    throw new Error("Not yet implemented");
  }

  close() {
    throw new Error("Not yet implemented");
  }

  send(data: string) {
    throw new Error("Not yet implemented");
  }
}
