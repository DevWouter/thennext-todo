import { Injectable } from "@angular/core";
import gql from "graphql-tag";

import { ApiService } from "./api.service";

const CREATE_ACCOUNT_QUERY = gql`
mutation createAccount($email: String!, $password: String!) {
  createAccount(input: {email: $email, password: $password}) {
    uuid
    email
  }
}`;

@Injectable()
export class AccountService {

  constructor(
    private apiService: ApiService,
  ) { }

  async createAccount(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.apollo.mutate({
        mutation: CREATE_ACCOUNT_QUERY,
        variables: {
          email: email,
          password: password
        }
      }).subscribe((x) => {
        resolve(x);
      });
    });
  }
}
