import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Session } from "./models/session.view-model";

@Injectable()
export class SessionService {
  constructor(
    private apiService: ApiService,
  ) { }

  async extendSession(): Promise<Session> {
    return this.apiService.patch<Session>("/api/session/extend", {}).toPromise();
  }

  async createSession(email: string, password: string): Promise<Session> {
    return this.apiService.post<Session>("/api/session/create", {
      email: email,
      password: password,
    }).toPromise();
  }
}
