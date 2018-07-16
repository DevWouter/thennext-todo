import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";
import { BehaviorSubject, Observable } from "rxjs";
import { MessageService } from "./message.service";
import { TokenService } from "./token.service";
import { filter } from "rxjs/operators";

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
}
