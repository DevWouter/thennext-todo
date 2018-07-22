import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { StorageService, StorageKey } from "./storage.service";
import { ApiEventService } from "./api-event.service";
import { TokenService } from "./token.service";

enum ActionEnum {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

@Injectable()
export class ApiService {
  private _sessionToken: string = undefined;

  constructor(
    private readonly apiEventService: ApiEventService,
    private client: HttpClient,
    private tokenService: TokenService,
  ) {
    // On load always retrieve the session key.
    this.tokenService.token.subscribe(x => this._sessionToken = x);
  }

  private handleError(action: ActionEnum, error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this.apiEventService.push(action as string, error.url, error.status, error.error);
    }

    // return an observable with a user-facing error message
    return throwError("The API returned an error");
  }

  get<T>(url: string): Observable<T> {
    return this.client
      .get<T>(url, this.options())
      .pipe(catchError(x => this.handleError(ActionEnum.GET, x)));
  }

  post<T>(url: string, data: any | null): Observable<T> {
    return this.client
      .post<T>(url, data, this.options())
      .pipe(catchError(x => this.handleError(ActionEnum.POST, x)));
  }

  patch<T>(url: string, data: any | null): Observable<T> {
    return this.client
      .patch<T>(url, data, this.options())
      .pipe(catchError(x => this.handleError(ActionEnum.PATCH, x)));
  }

  delete<T>(url: string): Observable<T> {
    return this.client
      .delete<T>(url, this.options())
      .pipe(catchError(x => this.handleError(ActionEnum.DELETE, x)));
  }

  private options(): { headers?: HttpHeaders } {
    if (this._sessionToken === undefined || this._sessionToken === null) {
      return undefined;
    }

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${this._sessionToken}`);

    return {
      headers: headers
    };
  }
}
