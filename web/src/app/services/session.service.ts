import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Session } from "selenium-webdriver";

export interface SessionResponse {
  token: string;
  expireAt: string;
}

@Injectable()
export class SessionService {
  constructor(
    private apiService: ApiService,
  ) { }

  async extendSession(): Promise<SessionResponse> {
    return this.apiService.patch<SessionResponse>("/api/session/extend", {}).toPromise();
  }

  async createSession(email: string, password: string): Promise<SessionResponse> {
    return this.apiService.post<SessionResponse>("/api/session/create", {
      email: email,
      password: password,
    }).toPromise();
  }
}
