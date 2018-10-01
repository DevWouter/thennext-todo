import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { Repository } from "./repositories/repository";
import { WsRepository } from "./repositories/ws-repository";

import { MessageService } from "./message.service";
import { UrgencyLap } from "../models";
import { ConnectionStateService } from "./connection-state.service";

@Injectable()
export class UrgencyLapService {
  private _repository: WsRepository<UrgencyLap>;

  public get entries(): Observable<UrgencyLap[]> {
    return this._repository.entries.pipe(filter(x => !!x));
  }

  constructor(
    messageService: MessageService,
    connectionStateService: ConnectionStateService,
  ) {
    this._repository = new WsRepository("urgency-lap", messageService);
    connectionStateService.state.subscribe(x => { if (x === "load") { this._repository.load(); } else { this._repository.unload(); } });
  }

  add(value: UrgencyLap): Promise<UrgencyLap> {
    return this._repository.add(value);
  }

  update(value: UrgencyLap): Promise<UrgencyLap> {
    return this._repository.update(value);
  }

  delete(value: UrgencyLap): Promise<UrgencyLap> {
    return this._repository.delete(value);
  }
}
