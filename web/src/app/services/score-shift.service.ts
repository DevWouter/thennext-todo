import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";
import { RepositoryEventHandler } from "./repositories/repository-event-handler";

import { ApiService } from "./api.service";

import { ScoreShift } from "./models/score-shift.dto";

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
    private apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/score-shift", new ScoreShiftRestoreTranslator());
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

  deleteMany(values: ScoreShift[]): Promise<ScoreShift[]> {
    return this._repository.deleteMany(values);
  }
}
