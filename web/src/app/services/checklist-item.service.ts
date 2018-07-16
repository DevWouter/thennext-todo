import { Injectable } from "@angular/core";

import { Observable, combineLatest } from "rxjs";

import { Repository } from "./repositories/repository";
import { ChecklistItem } from "./models/checklist-item.dto";
import { TaskEventService } from "./task-event.service";
import { map } from "rxjs/operators";
import { MessageService } from "./message.service";
import { WsRepository } from "./repositories/ws-repository";

@Injectable()
export class ChecklistItemService {
  private _repository: Repository<ChecklistItem>;
  public get entries(): Observable<ChecklistItem[]> {
    return this._repository.entries.pipe(map(x => x.sort((a, b) => a.order - b.order)));
  }

  constructor(
    messageService: MessageService,
    private taskEventService: TaskEventService,
  ) {
    this._repository = new WsRepository("checklist-item", messageService);
    combineLatest(this.taskEventService.deletedTask, this._repository.entries)
      .subscribe(([task, checklistItems]) => {
        // Find all relations beloning to the task and delete them.
        const items = checklistItems
          .filter(x => x.taskUuid === task.uuid);
        this._repository.removeMany(items, { onlyInternal: true });
      });
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
