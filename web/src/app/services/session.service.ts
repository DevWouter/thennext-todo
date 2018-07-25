import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Session } from "../models";
import { TokenService } from "./token.service";

@Injectable()
export class SessionService {

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
  ) { }

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

    this.tokenService.clear();
  }
}
