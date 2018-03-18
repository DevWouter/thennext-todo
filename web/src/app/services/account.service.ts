import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import gql from "graphql-tag";


const CREATE_ACCOUNT_QUERY = gql`
mutation ($email: String!, $password: String!) {
  createAccount(input: {email: $email, password: $password}) {
    uuid
    email
  }
}
`;

@Injectable()
export class AccountService {

  constructor(private apiService: ApiService) {

  }
  async createAccount(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.apollo.mutate({
        mutation: CREATE_ACCOUNT_QUERY,
        variables: {
          email: "wouter.lindenhof@gmail.com",
          password: "abcdef"
        }
      }).subscribe((x) => {
        resolve(x);
      });
    });
  }

}
