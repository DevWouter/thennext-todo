import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { StorageService, StorageKey } from "./storage.service";


@Injectable()
export class ApiService {
  private _sessionToken: string = undefined;

  constructor(
    private storageService: StorageService,
    private client: HttpClient,
  ) {
    // On load always retrieve the session key.
    this._sessionToken = this.storageService.get(StorageKey.SESSION_TOKEN);
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
    this._sessionToken = token;
    this.storageService.set(StorageKey.SESSION_TOKEN, token);
    this.storageService.set(StorageKey.SESSION_EXPIRE, expireAt);
  }

  private options(): { headers?: HttpHeaders } {
    if (this._sessionToken === undefined) {
      return undefined;
    }

    let headers = new HttpHeaders();
    headers = headers.set("Authorization", `Bearer ${this._sessionToken}`);

    return {
      headers: headers
    };
  }
}
