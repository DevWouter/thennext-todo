import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import gql from "graphql-tag";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";


const CREATE_ACCOUNT_QUERY = gql`
mutation ($email: String!, $password: String!) {
  createAccount(input: {email: $email, password: $password}) {
    uuid
    email
  }
}
`;

const ACCOUNTS_QUERY = gql`
query {
  accounts {
    uuid
    email
  }
}`;

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

  getAccounts(): Observable<any> {
    const la = new BehaviorSubject<any>(undefined);
    const query = this.apiService.apollo.watchQuery({ query: ACCOUNTS_QUERY, fetchPolicy: "cache-and-network" });
    query.valueChanges.subscribe(x => la.next(x));

    return la;
  }

}
