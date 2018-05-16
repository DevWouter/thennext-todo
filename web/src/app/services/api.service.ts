import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { StorageService, StorageKey } from "./storage.service";


@Injectable()
export class ApiService {
  private _sessionToken: string = undefined;
  private _sessionTokenSubject = new BehaviorSubject<string>(null);

  public get sessionToken(): Observable<string> {
    return this._sessionTokenSubject;
  }

  constructor(
    private storageService: StorageService,
    private client: HttpClient,
  ) {
    // On load always retrieve the session key.
    this._sessionTokenSubject.next(this.storageService.get(StorageKey.SESSION_TOKEN));
  }

  get<T>(url: string): Observable<T> {
    return this.client
      .get<T>(url, this.options());
  }

  post<T>(url: string, data: any | null): Observable<T> {
    return this.client
      .post<T>(url, data, this.options());
  }

  patch<T>(url: string, data: any | null): Observable<T> {
    return this.client
      .patch<T>(url, data, this.options());
  }

  delete<T>(url: string): Observable<T> {
    return this.client
      .delete<T>(url, this.options());
  }

  setSessionToken(token: string, expireAt: string) {
    // Store session token first and then also store it so we can retrieve it later.
    this.storageService.set(StorageKey.SESSION_TOKEN, token);
    this.storageService.set(StorageKey.SESSION_EXPIRE, expireAt);
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
