import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Session } from "./models/session.dto";

@Injectable()
export class SessionService {

  constructor(
    private apiService: ApiService,
  ) { }

  async extendSession(): Promise<Session> {
    return this.apiService.patch<Session>("/api/session/extend", {}).toPromise();
  }

  createSession(email: string, password: string): Promise<Session> {
    return this.apiService.post<Session>("/api/session/create", {
      email: email,
      password: password,
    }).toPromise();
  }

  async logout(): Promise<void> {
    await this.apiService.delete<object>("/api/session/destroy")
      .toPromise()
      .catch((reason) => console.error(reason));

    this.apiService.setSessionToken(undefined);
  }
}
