import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Session } from "../models";
import { TokenService } from "./token.service";

interface ConfirmTokenResponse {
  state: "confirmed" | "already-confirmed" | "rejected";
}

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

  /**
   * Ask the REST-API to confirm an account token.
   * @param token The token that was send with the e-mail
   */
  async confirm(token: string): Promise<"confirmed" | "already-confirmed" | "rejected"> {
    try {
      const response = await this.apiService.post<ConfirmTokenResponse>("/api/account/confirm-token", {
        token: token,
      }).toPromise();
      return response.state;
    } catch (reason) {
      throw reason;
    }
  }
}
