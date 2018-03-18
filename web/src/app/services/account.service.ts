import { Injectable } from "@angular/core";

const CREATE_ACCOUNT_QUERY = `
mutation ($email: String!, $password: String!) {
  createAccount(input: {email: $email, password: $password}) {
    uuid
    email
  }
}
`;

@Injectable()
export class AccountService {

  constructor() { }
  async createAccount(email: string, password: string): Promise<void> {

  }

}
