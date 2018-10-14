import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

import { ApiService } from "./api.service";
import { MessageService } from "./message.service";
import { TokenService } from "./token.service";
import { promise } from "selenium-webdriver";

interface Account {
  uuid: string;
  email: string;
}

interface MyAccount {
  uuid: string;
  displayName: string;
}


interface ResetPasswordRequest {
  token: string;
  email: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  state: "rejected" | "accepted";
  message?: string;
}

export interface CreateRecoveryTokenResponse {
  state: "recovery-send" | "rejected" | "unconfirmed";
  message?: string;
};

@Injectable()
export class AccountService {
  private _myAccount = new BehaviorSubject<MyAccount>(undefined);
  public get myAccount(): Observable<MyAccount> { return this._myAccount; }

  constructor(
    private apiService: ApiService,
    private messageSerivce: MessageService,
    private tokenService: TokenService,
  ) {

    this.messageSerivce.eventsOf("my-account-synced")
      .subscribe(ev => {
        this._myAccount.next({
          uuid: ev.data.uuid,
          displayName: ev.data.displayName,
        });
      });

    this.tokenService.token
      .subscribe((token) => {
        if (!token) {
          this._myAccount.next(undefined);
        } else {
          // Send a message that we want the account synced.
          this.messageSerivce.send("sync-my-account", {});
        }
      });
  }

  async createAccount(email: string, password: string): Promise<Account> {
    const accountData = await this.apiService
      .post<Account>("/api/account/", { email: email, password: password })
      .toPromise();
    return accountData;
  }

  updatePersonal(change: Partial<MyAccount>) {
    if (change.uuid !== undefined) {
      throw new Error("You can't change your own uuid");
    }

    this.messageSerivce.send("update-my-account", {
      displayName: change.displayName
    });
  }

  updatePassword(password: string): any {
    this.messageSerivce.send("update-my-password", {
      newPassword: password
    });
  }

  async requestRecoveryToken(email: string): Promise<CreateRecoveryTokenResponse> {
    const recoveryResponse = await this.apiService
      .post<CreateRecoveryTokenResponse>("/api/account/create-recovery-token", { email: email })
      .toPromise();

    return recoveryResponse;
  }

  async resetPassword(token: string, email: string, password: string): Promise<ResetPasswordResponse> {
    const response = await this.apiService
      .post<ResetPasswordResponse>("/api/account/reset-password", <ResetPasswordRequest>{ token: token, email: email, newPassword: password })
      .toPromise();

    return response;
  }
}
