import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";

import { ApiRepository } from "./repositories/api-repository";
import { Repository } from "./repositories/repository";

import { ApiService } from "./api.service";

import { ChecklistItem } from "./models/checklist-item.dto";
import { TaskEventService } from "./task-event.service";

@Injectable()
export class ChecklistItemService {
  private _repository: Repository<ChecklistItem>;
  public get entries(): Observable<ChecklistItem[]> {
    return this._repository.entries;
  }

  constructor(
    private apiService: ApiService,
    private taskEventService: TaskEventService,
  ) {
    this._repository = new ApiRepository(apiService, "/api/checklist-item");
    this.taskEventService.deletedTask
      .combineLatest(this._repository.entries, (task, checklistItems) => {
        // Find all relations beloning to the task and delete them.
        const items = checklistItems
          .filter(x => x.taskUuid === task.uuid);
        this._repository.removeMany(items, { onlyInternal: true });
      }).subscribe();
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
}
