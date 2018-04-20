import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";

import { ApiService } from "./api.service";

import { ChecklistItem } from "./models/checklist-item.dto";

@Injectable()
export class ChecklistItemService {
  private _repository: Repository<ChecklistItem>;
  public get entries(): Observable<ChecklistItem[]> {
    return this._repository.entries;
  }

  constructor(
    private apiService: ApiService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/checklist-item");
  }

  add(value: ChecklistItem): Promise<ChecklistItem> {
    return this._repository.add(value);
  }

  update(value: ChecklistItem): Promise<ChecklistItem> {
    return this._repository.update(value);
  }

  delete(value: ChecklistItem): Promise<ChecklistItem> {
    return this._repository.delete(value);
  }

  deleteMany(values: ChecklistItem[]): Promise<ChecklistItem[]> {
    return this._repository.deleteMany(values);
  }
}
