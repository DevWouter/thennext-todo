import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";
import { BehaviorSubject, Observable } from "rxjs";

interface Account {
  uuid: string;
  email: string;
}

interface MyAccount {
  uuid: string;
  displayName: string;
}

@Injectable()
export class AccountService {
  private _myAccount = new BehaviorSubject<MyAccount>(undefined);
  public get myAccount(): Observable<MyAccount> { return this._myAccount; }

  constructor(
    private apiService: ApiService,
  ) {
    this.apiService.sessionToken.subscribe(token => {
      if (token) {
        // Try and restore the token
        this.apiService.get<MyAccount>("/api/account/me")
          .subscribe(account => this._myAccount.next(account));
      } else {
        // We no longer know our own account.
        this._myAccount.next(undefined);
      }
    });
  }

  async createAccount(email: string, password: string): Promise<Account> {
    const accountData = await this.apiService
      .post<Account>("/api/account/", { email: email, password: password })
      .toPromise();
    return accountData;
  }
}
