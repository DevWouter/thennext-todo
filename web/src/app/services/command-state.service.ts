import { Injectable } from "@angular/core";

import { Observable, BehaviorSubject } from "rxjs";

@Injectable()
export class CommandStateService {
  private readonly $commandText = new BehaviorSubject<string>(undefined);

  public get commandText(): Observable<string> {
    return this.$commandText.asObservable();
  }

  public setCommandText(command: string) {
    this.$commandText.next(command);
  }
}
