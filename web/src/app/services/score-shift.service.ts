import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ScoreShift } from "../models";
import { MessageBusService, Repository } from "./message-bus";
import { filter } from "rxjs/operators";

function fixDate(v: string | Date): Date {
  if (typeof (v) === "string") {
    return new Date(Date.parse(v));
  }

  return v;
}

function reviveScoreShift(key: keyof ScoreShift, value: any): any {
  if (key === "createdOn") { return fixDate(value); }
  if (key === "updatedOn") { return fixDate(value); }
  return value;
}

@Injectable()
export class ScoreShiftService {
  private _repository: Repository<ScoreShift>;
  public get entries(): Observable<ScoreShift[]> {
    return this._repository.entities;
  }

  constructor(
    private readonly messageBusService: MessageBusService,
  ) {
    const sender = this.messageBusService.createSender<ScoreShift>("score-shift", reviveScoreShift);
    const receiver = this.messageBusService.createReceiver<ScoreShift>("score-shift", reviveScoreShift);

    this._repository = new Repository(sender, receiver);

    this.messageBusService.status
      .pipe(filter(x => x.status === "accepted"))
      .subscribe(() => {
        this._repository.sync();
      });
  }

  add(value: ScoreShift): Promise<ScoreShift> {
    if (!value.createdOn) {
      value.createdOn = new Date();
    }
    if (!value.updatedOn) {
      value.updatedOn = new Date();
    }

    value.score = value.score || 0;
    return this._repository.add(value).toPromise();
  }

  update(value: ScoreShift): Promise<ScoreShift> {
    value.updatedOn = new Date();
    return this._repository.update(value).toPromise();
  }

  delete(value: ScoreShift): Promise<ScoreShift> {
    return this._repository.remove(value).toPromise().then(() => value);
  }
}
