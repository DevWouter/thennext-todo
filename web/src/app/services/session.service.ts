import { Injectable } from "@angular/core";
import gql from "graphql-tag";

import { ApiService } from "./api.service";

const CREATE_SESSION = gql`
mutation createSession($email: String!, $password: String!) {
  createSession(email: $email, password: $password) {
    token
    expireAt
  }
}`;

@Injectable()
export class SessionService {
  constructor(
    private apiService: ApiService,
  ) { }

  async createSession(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.apiService.apollo.mutate({
        mutation: CREATE_SESSION,
        variables: {
          email: email,
          password: password
        }
      }).subscribe((x) => {
        resolve(x);
      }, (reason) => reject(reason));
    });
  }
}
