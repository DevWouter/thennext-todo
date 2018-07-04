import { Observable, BehaviorSubject, Subject } from "rxjs";

/**
 * The status of the webservice
 */
export enum WsConnectionStatus {
  /**
   * The service is busy connecting.
   */
  INIT = "init",

  /**
   * The service has connected.
   */
  OPEN = "open",

  /**
   * The connection was closed (and once closed it will never re-open)
   */
  CLOSED = "closed"
}

/**
 * The configuration of the webservice.
 */
export interface WsServiceConfig {
  /**
   * The url that we connect to, needs to include the protocol `ws` or `wss`.
   */
  url: string;

  /**
   * One or more protocols that can be used by the server to identify the connecting service.
   */
  protocols?: string | string[];
}

/**
 * A basic WebService that has wrapped everything in an observable.
 * If an error or close occurs, you need to create a new WsService.
 */
export class WsService {
  private readonly _ws: WebSocket;

  private readonly $connectionStatus = new BehaviorSubject<WsConnectionStatus>(WsConnectionStatus.INIT);
  private readonly $message = new Subject<any>();

  public get connectionStatus(): Observable<WsConnectionStatus> { return this.$connectionStatus; }
  public get message(): Observable<any> { return this.$message; }

  /**
   * Creates a new WebService.
   * @param config The configuration of the webservice.
   */
  constructor(config: WsServiceConfig) {
    this._ws = new WebSocket(config.url, config.protocols);
    this._ws.addEventListener("open", this.onOpen);
    this._ws.addEventListener("message", this.onMessage);
    this._ws.addEventListener("close", this.onClose);
    this._ws.addEventListener("error", this.onError);
  }

  /**
   * Sends a message to the server.
   * @param data The data that needs to be send to the server.
   */
  public send(data: string | SharedArrayBuffer | ArrayBuffer | Blob | ArrayBufferView) {
    if (this.$connectionStatus.value !== WsConnectionStatus.OPEN) {
      throw new Error("The service is not yet ready");
    }

    this._ws.send(data);
  }

  /**
   * Close the connection.
   */
  public close() {
    this.markAsClosed();
  }

  private onOpen(ev: Event): void {
    // Connection has been opened and as such we are "UP"
    this.$connectionStatus.next(WsConnectionStatus.OPEN);
  }
  private onMessage(ev: MessageEvent): void {
    const data = ev.data;
    this.$message.next(data);
  }
  private onClose(ev: CloseEvent): void {
    this.markAsClosed();
  }

  private onError(ev: Event): void {
    console.error("Websocket error", ev);
    this.markAsClosed();
  }

  private markAsClosed() {
    const isClosed = this.$connectionStatus.value === WsConnectionStatus.CLOSED;

    if (!isClosed) {
      this._ws.close();

      this.$connectionStatus.next(WsConnectionStatus.CLOSED);
      this.$connectionStatus.complete();
      this.$message.complete();
    }

  }
}
