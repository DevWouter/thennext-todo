import { Injectable } from "@angular/core";

import { Observable, combineLatest } from "rxjs";
import { map, filter } from "rxjs/operators";

import { TaskEventService } from "./task-event.service";

import { ChecklistItem } from "../models";
import { MessageBusService, Repository } from "./message-bus";

@Injectable()
export class ChecklistItemService {
  private _repository: Repository<ChecklistItem>;
  public get entries(): Observable<ChecklistItem[]> {
    return this._repository.entities.pipe(map(x => x.sort((a, b) => a.order - b.order)));
  }

  constructor(
    private readonly messageBusService: MessageBusService,
    private taskEventService: TaskEventService,
  ) {

    const sender = this.messageBusService.createSender<ChecklistItem>("checklist-item", undefined);
    const receiver = this.messageBusService.createReceiver<ChecklistItem>("checklist-item", undefined);

    this._repository = new Repository(sender, receiver);

    combineLatest(this.taskEventService.deletedTask, this._repository.entities)
      .subscribe(([task, checklistItems]) => {
        // Find all relations beloning to the task and delete them.
        const items = checklistItems
          .filter(x => x.taskUuid === task.uuid);
        items.forEach(item => {
          this._repository.remove(item);
        });
      });
  }

  add(value: ChecklistItem): Promise<ChecklistItem> {
    return this._repository.add(value).toPromise();
  }

  update(value: ChecklistItem): Promise<ChecklistItem> {
    return this._repository.update(value).toPromise();
  }

  delete(value: ChecklistItem): Promise<ChecklistItem> {
    return this._repository.remove(value).toPromise().then(() => value);
  }
}
