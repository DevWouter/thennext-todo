import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";

@Injectable()
export class AccountService {

  constructor(
    private apiService: ApiService,
  ) { }

  async createAccount(email: string, password: string): Promise<Object> {
    return this.apiService.post("/api/account/", {email: email, password: password});
  }
}
