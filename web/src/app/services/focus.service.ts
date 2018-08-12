import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

type ElementType = "checklistItem" | "task";

export interface FocusElementRequest {
  type: ElementType;
  uuid: string;
}

@Injectable()
export class FocusService {
  private readonly $request = new Subject<FocusElementRequest>();
  public get request(): Observable<FocusElementRequest> {
    return this.$request.pipe(
      filter(x => !!x),
    );
  }

  setFocus(type: ElementType, uuid: string) {
    this.$request.next({
      type: type,
      uuid: uuid,
    });
  }
}
