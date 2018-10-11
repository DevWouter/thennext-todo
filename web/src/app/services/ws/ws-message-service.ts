import { Observable, BehaviorSubject, Subscription, combineLatest, Subject } from "rxjs";
import { filter } from "rxjs/operators";

import { WsService, WsConnectionStatus, WsServiceConfig } from "./ws-service";
import { TokenService } from "../token.service";

import { WsCommandMap } from "./commands";
import { WsEventMap, WsEvent, WsEventBasic } from "./events";

export interface WsError {
  readonly reason: string;
  readonly requireLogin: boolean;
}

export class WsMessageService {
  private _wsService: WsService = undefined;
  private _conSub: Subscription = undefined;
  private _msgSub: Subscription = undefined;
  private _msgQueue: string[] = []; // An array of messages to send.
  private _wasUp = false;

  private readonly $msgQueue = new BehaviorSubject<string[]>(this._msgQueue);
  private readonly $status = new BehaviorSubject<"up" | "down">("down");
  private readonly $event = new Subject<WsEventBasic>();

  public readonly $error = new Subject<WsError>();

  get status(): Observable<"up" | "down"> { return this.$status; }
  get event(): Observable<WsEventBasic> { return this.$event; }

  constructor(
    private readonly wsServiceConfig: WsServiceConfig,
    private readonly tokenService: TokenService,
  ) {
    this.setup();
  }

  private setup() {
    // Setup the message handler
    combineLatest(
      this.$status,
      this.$msgQueue,
    ).subscribe(([status, messages]) => {
      // Early out when:--------------v
      if (
        status !== "up" ||            // The service is down.
        messages === undefined ||     // The message queue is undefined (no messages)
        messages.length === 0         // There are no messages in the queue.
      ) {
        return;
      }

      // Clear the queue (we have a local copy)
      this._msgQueue = [];
      this.$msgQueue.next(this._msgQueue);

      // Send the messages in the local queue.
      messages.forEach(x => this._wsService.send(x));
    });

    // If the token is unset, then perform a disconnect.
    this.tokenService.token
      .pipe(filter(x => !x))
      .subscribe(() => this.disconnect());
  }

  connect() {
    if (this._wsService) {
      // Already connected.
      return;
    }

    this._wsService = new WsService(this.wsServiceConfig);

    this._msgSub = this._wsService.message.subscribe((data) => {
      const event = JSON.parse(data) as WsEventBasic;
      this.onEvent(event);
    });

    // When the status becomes closed, set status to down.
    this._wsService.connectionStatus
      .pipe(filter(x => x === WsConnectionStatus.CLOSED))
      .subscribe(() => {
        if (this._wasUp === false) {
          this.$status.next("up");
        }
        this.$status.next("down");
      }
      );

    this._conSub = combineLatest(
      this._wsService.connectionStatus,
      this.tokenService.token.pipe(filter(x => !!x))).subscribe(([status, token]) => {
        if (status === WsConnectionStatus.OPEN) {
          // Connection is open, we can send data, but first send the token.
          this._wasUp = true;
          this.sendDirect("set-token", { token: token });
        }
      });
  }

  disconnect() {
    if (!this._wsService) {
      // Already disconnected.
      return;
    }

    // Create a copy of the service so that we can prevent re-entrent later.
    const currentService = this._wsService;
    this._wsService = undefined;

    // Remove the subscription.
    this._conSub.unsubscribe();
    this._msgSub.unsubscribe();

    this._conSub = undefined;
    this._msgSub = undefined;
    this.$status.next("down");

    // Clear the message queue.
    this._msgQueue = [];
    this.$msgQueue.next(this._msgQueue);

    // Tell the service to try and close the connection.
    currentService.close();
  }

  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    const rawCommand = { command: type, data: data };
    const rawCommandJson = JSON.stringify(rawCommand);
    this.addToCommandQueue(rawCommandJson);
  }

  private onEvent<K extends keyof WsEventMap>(data: WsEventBasic): void {
    switch (data.type) {
      case "token-accepted": {
        // Token was accepted. Simply set the status to up.
        // All queued messages will then be send to the server.
        this.$status.next("up");
      } break;
      case "token-rejected": {
        // Log the reason for the rejection and then perform a disconnect.
        const reason = `Token was rejected: ${(data as WsEvent<"token-rejected">).data.reason}`;
        console.error(reason);
        this.$error.next({ reason: reason, requireLogin: true });
        this.disconnect();
        this.$status.next("down");
      } break;
      default: {
        this.$event.next(data);
      } break;
    }
  }

  private sendDirect<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    const rawCommand = { command: type, data: data };
    const rawCommandJson = JSON.stringify(rawCommand);
    this._wsService.send(rawCommandJson);
  }

  private addToCommandQueue(command: string): void {
    // Add it to the internal queue and send it.
    this._msgQueue.push(command);
    this.$msgQueue.next(this._msgQueue);
  }
}

