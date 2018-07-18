import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { StorageService, StorageKey } from "./storage.service";
import { ApiEventService } from "./api-event.service";

enum ActionEnum {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

@Injectable()
export class ApiService {
  private _sessionToken: string = undefined;
  private _sessionTokenSubject = new BehaviorSubject<string>(null);

  public get sessionToken(): Observable<string> {
    return this._sessionTokenSubject;
  }

  constructor(
    private readonly apiEventService: ApiEventService,
    private client: HttpClient,
    private storageService: StorageService,
  ) {
    // On load always retrieve the session key.
    this._sessionTokenSubject.next(this.storageService.get(StorageKey.SESSION_TOKEN));
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

  setSessionToken(token: string) {
    // Store session token first and then also store it so we can retrieve it later.
    this.storageService.set(StorageKey.SESSION_TOKEN, token);
    this._sessionTokenSubject.next(token);
  }

  private options(): { headers?: HttpHeaders } {
    const sessionTokenValue = this._sessionTokenSubject.value;
    if (sessionTokenValue === undefined || sessionTokenValue === null) {
      return undefined;
    }

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${sessionTokenValue}`);

    return {
      headers: headers
    };
  }
}
