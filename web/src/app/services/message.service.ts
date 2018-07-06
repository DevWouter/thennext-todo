import { Injectable, OnDestroy } from "@angular/core";
import { WsMessageService } from "./ws/ws-message-service";
import { WsServiceConfig } from "./ws/ws-service";
import { TokenService } from "./token.service";
import { environment } from "../../environments/environment";
import { WsCommandMap } from "./ws/commands";
import { StorageService, StorageKey } from "./storage.service";


/**
 * The generic version of the WsMessageService.
 */
@Injectable()
export class MessageService implements OnDestroy {
  private _wsMessageService: WsMessageService;
  private readonly wsServiceConfig: WsServiceConfig = { url: environment.wsEndPoint };

  constructor(
    private readonly tokenService: TokenService,
    private readonly storageService: StorageService,
  ) {
    this.setup();
  }

  private setup() {
    this._wsMessageService = new WsMessageService(this.wsServiceConfig, this.tokenService);
    // TODO: Listen to messages.

    // Start the service
    this._wsMessageService.connect();

    // HACK: Manual retrieving the token.
    const token = this.storageService.get(StorageKey.SESSION_TOKEN);
    this.tokenService.set(token);
  }


  send<K extends keyof WsCommandMap>(type: K, data: WsCommandMap[K]): void {
    console.log("Sending messages");
    this._wsMessageService.send(type, data);
  }

  ngOnDestroy(): void {
    // Close the connection
    this._wsMessageService.disconnect();
  }
}
