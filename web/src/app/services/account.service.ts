import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";

interface Account {
  uuid: string;
  email: string;
}

@Injectable()
export class AccountService {

  constructor(
    private apiService: ApiService,
  ) { }

  async createAccount(email: string, password: string): Promise<Account> {
    const accountData = await this.apiService
      .post<Account>("/api/account/", { email: email, password: password })
      .toPromise();
    return accountData;
  }
}
