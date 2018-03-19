import { Injectable } from "@angular/core";
import gql from "graphql-tag";

import { ApiService } from "./api.service";
import { createSessionMutation, createSessionMutationVariables } from "./graphql-types/operation-result-types";

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

  async createSession(email: string, password: string): Promise<createSessionMutation> {
    const variables = <createSessionMutationVariables>{ email, password };
    return new Promise<createSessionMutation>((resolve, reject) => {
      this.apiService.apollo.mutate<createSessionMutation, createSessionMutationVariables>({
        mutation: CREATE_SESSION,
        variables,
      }).subscribe((x) => {
        resolve(x.data as createSessionMutation);
      }, reject);
    });
  }
}
