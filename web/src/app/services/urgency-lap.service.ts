import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";

import { ApiService } from "./api.service";

import { UrgencyLap } from "./models/urgency-lap.dto";


@Injectable()
export class UrgencyLapService {
  private _repository: Repository<UrgencyLap>;

  public get entries(): Observable<UrgencyLap[]> {
    return this._repository.entries.pipe(filter(x => !!x));
  }

  constructor(
    apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/urgency-lap");
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
