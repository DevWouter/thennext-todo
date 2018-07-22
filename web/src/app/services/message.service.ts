import { Injectable, OnDestroy } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { filter, map, skipUntil } from "rxjs/operators";

import { WsMessageService } from "./ws/ws-message-service";
import { WsServiceConfig } from "./ws/ws-service";
import { WsCommandMap } from "./ws/commands";
import { WsEventMap, WsEventBasic, WsEvent } from "./ws/events";

import { TokenService } from "./token.service";
import { StorageService, StorageKey } from "./storage.service";

import { environment } from "../../environments/environment";

/**
 * The generic version of the WsMessageService.
 */
@Injectable()
export class MessageService implements OnDestroy {
  private _wsMessageService: WsMessageService;
  private readonly wsServiceConfig: WsServiceConfig = { url: environment.wsEndPoint };
  private readonly $event = new Subject<WsEventBasic>();
  private readonly $status = new BehaviorSubject<"up" | "down">(undefined);

  get status(): Observable<"up" | "down"> { return this.$status.pipe(filter(x => !!x)); }

  constructor(
    private readonly tokenService: TokenService,
    private readonly storageService: StorageService,
  ) {
    this.setup();
  }

  private setup() {
    this._wsMessageService = new WsMessageService(this.wsServiceConfig, this.tokenService);
    this._wsMessageService.event.subscribe((message) => {
      try {
        if (!message.type) {
          throw new Error("The parsed object has no type");
        }

        if (message) {
          this.$event.next(message);
        }
      } catch (reason) {
        console.error(reason, message);
      }
    });

    const $firstUpMessage = this._wsMessageService.status.pipe(
      filter(x => x === "up"),
    );

    this._wsMessageService.status.pipe(
      skipUntil($firstUpMessage),
    ).subscribe(x => {
      this.$status.next(x);
    });

    // Start the service
    this._wsMessageService.connect();
  }


  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    this._wsMessageService.send(type, data);
  }

  eventsOf<K extends keyof WsEventMap>(type: K): Observable<WsEvent<K>> {
    return this.$event
      .pipe(
        filter(x => x.type === type),
        map(x => x as WsEvent<K>),
    );
  }

  ngOnDestroy(): void {
    // Close the connection
    this._wsMessageService.disconnect();
  }
}
