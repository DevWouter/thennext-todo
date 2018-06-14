import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

interface ApiEvent {
  action: string;
  url: string;
  statusCode: number;
  error: any;
}

/**
 * The API Event Service is intended to be used to listen to problems that might occur with the API.
 */
@Injectable()
export class ApiEventService {
  private _publisher = new BehaviorSubject<ApiEvent>(undefined);
  public get recentEvents(): Observable<ApiEvent> {
    return this._publisher.pipe(filter(x => !!x));
  }

  constructor() {
    // Send any error also to the console.
    this.recentEvents.subscribe(console.error);
  }

  push(action: string, url: string, statusCode: number, error: any) {
    this._publisher.next({
      action: action,
      url: url,
      statusCode: statusCode,
      error: error
    });
  }
}
