import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { filter, tap } from "rxjs/operators";

import { UrgencyLap } from "../models";
import { Repository } from "./message-bus/repository";
import { MessageBusService } from "./message-bus";

@Injectable()
export class UrgencyLapService {
  private _repository: Repository<UrgencyLap>;

  public get entries(): Observable<UrgencyLap[]> {
    return this._repository.entities.pipe(filter(x => !!x));
  }

  constructor(
    private readonly messageBusService: MessageBusService,
  ) {
    this.setup();
  }

  private setup() {
    const sender = this.messageBusService.createSender<UrgencyLap>("urgency-lap", undefined);
    const receiver = this.messageBusService.createReceiver<UrgencyLap>("urgency-lap", undefined);

    this._repository = new Repository(sender, receiver);

    this.messageBusService.status
      .pipe(filter(x => x.status === "accepted"))
      .subscribe(() => {
        this._repository.sync();
      });
  }

  add(value: UrgencyLap): Promise<UrgencyLap> {
    return this._repository.add(value).toPromise();
  }

  update(value: UrgencyLap): Promise<UrgencyLap> {
    return this._repository.update(value).toPromise();
  }

  delete(value: UrgencyLap): Promise<UrgencyLap> {
    return this._repository.remove(value)
      .toPromise()
      .then(() => value);
  }
}
