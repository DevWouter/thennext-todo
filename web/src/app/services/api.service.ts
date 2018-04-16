import { Injectable } from "@angular/core";
import { StorageService, StorageKey } from "./storage.service";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";



@Injectable()
export class ApiService {
  private _sessionToken: string = undefined;
  private _ready = new BehaviorSubject<boolean>(false);
  public get ready(): Observable<boolean> {
    return this._ready;
  }

  constructor(
    private storageService: StorageService,
    private client: HttpClient,
  ) {
    // On load always retrieve the session key.
    this._sessionToken = this.storageService.get(StorageKey.SESSION_TOKEN);
    this._ready.next(true);
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

    const headers = new HttpHeaders();
    headers.set("Authorization", `Bearer ${this._sessionToken}`);

    return {
      headers: headers
    };
  }
}
