import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { MessageService } from "./message.service";


@Injectable()
export class ConnectionStateService {
  private $state = new BehaviorSubject<"load" | "unload">("load");
  public get state(): Observable<"load" | "unload"> {
    return this.$state
      .pipe(distinctUntilChanged((x, y) => x === y));
  }

  constructor(
    messageService: MessageService,
  ) {
    messageService.status.subscribe(x => {
      this.$state.next(x === "up" ? "load" : "unload");
    });
  }
}
