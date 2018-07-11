import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { Repository } from "./repositories/repository";
import { RepositoryEventHandler } from "./repositories/repository-event-handler";

import { ScoreShift } from "./models/score-shift.dto";
import { WsRepository } from "./repositories/ws-repository";
import { MessageService } from "./message.service";

class ScoreShiftRestoreTranslator implements RepositoryEventHandler<ScoreShift> {
  onItemLoad(entry: ScoreShift): void {
    entry.createdOn = this.fixDate(entry.createdOn);
    entry.updatedOn = this.fixDate(entry.updatedOn);
  }

  fixDate(v: string | Date): Date {
    if (v === null || v === undefined) {
      return undefined;
    }

    if (typeof (v) === "string") {
      const vs = <string>(v);
      return new Date(Date.parse(vs));
    }

    // We can assume it is a date.
    return <Date>v;
  }
}

@Injectable()
export class ScoreShiftService {
  private _repository: Repository<ScoreShift>;
  public get entries(): Observable<ScoreShift[]> {
    return this._repository.entries;
  }

  constructor(
    messageService: MessageService,
  ) {
    this._repository = new WsRepository<ScoreShift>("score-shift", messageService, new ScoreShiftRestoreTranslator());
  }

  add(value: ScoreShift): Promise<ScoreShift> {
    if (!value.createdOn) {
      value.createdOn = new Date();
    }
    if (!value.updatedOn) {
      value.updatedOn = new Date();
    }

    value.score = value.score || 0;
    return this._repository.add(value);
  }

  update(value: ScoreShift): Promise<ScoreShift> {
    value.updatedOn = new Date();
    return this._repository.update(value);
  }

  delete(value: ScoreShift): Promise<ScoreShift> {
    return this._repository.delete(value);
  }
}
