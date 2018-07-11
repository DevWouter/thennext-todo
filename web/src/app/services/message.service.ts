import { Injectable, OnDestroy } from "@angular/core";
import { Subscription, Subject, Observable } from "rxjs";
import { WsMessageService } from "./ws/ws-message-service";
import { WsServiceConfig } from "./ws/ws-service";
import { TokenService } from "./token.service";
import { environment } from "../../environments/environment";
import { WsCommandMap } from "./ws/commands";
import { StorageService, StorageKey } from "./storage.service";
import { WsEventMap,  WsEventBasic, WsEvent } from "./ws/events";
import { filter, map } from "rxjs/operators";


/**
 * The generic version of the WsMessageService.
 */
@Injectable()
export class MessageService implements OnDestroy {
  private _wsMessageService: WsMessageService;
  private readonly wsServiceConfig: WsServiceConfig = { url: environment.wsEndPoint };
  private readonly $event = new Subject<WsEventBasic>();

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

    // Start the service
    this._wsMessageService.connect();

    // HACK: Manual retrieving the token.
    // TODO: Maybe move it somewhere else? But where?
    const token = this.storageService.get(StorageKey.SESSION_TOKEN);
    this.tokenService.set(token);
  }


  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    console.log("Sending messages");
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
