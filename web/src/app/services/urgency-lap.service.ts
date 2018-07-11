import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { Repository } from "./repositories/repository";

import { UrgencyLap } from "./models/urgency-lap.dto";
import { WsRepository } from "./repositories/ws-repository";
import { MessageService } from "./message.service";


@Injectable()
export class UrgencyLapService {
  private _repository: Repository<UrgencyLap>;

  public get entries(): Observable<UrgencyLap[]> {
    return this._repository.entries.pipe(filter(x => !!x));
  }

  constructor(
    messageService: MessageService,
  ) {
    this._repository = new WsRepository("urgency-lap", messageService);
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
