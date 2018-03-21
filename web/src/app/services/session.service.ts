import { Injectable } from "@angular/core";
import gql from "graphql-tag";

import { ApiService } from "./api.service";
import {
  createSessionMutation,
  createSessionMutationVariables,
  extendSessionMutation,
  extendSessionMutationVariables,
} from "./graphql-types/operation-result-types";

const CREATE_SESSION = gql`
mutation createSession($email: String!, $password: String!) {
  createSession(email: $email, password: $password) {
    token
    expireAt
  }
}`;

const EXTEND_SESSION = gql`
mutation extendSession($token: String!){
  extendSession(token: $token) {
    token
    expireAt
  }
}`;

@Injectable()
export class SessionService {
  constructor(
    private apiService: ApiService,
  ) { }

  /**
   * Extends a session.
   * @param token The token that needs to be extended.
   */
  async extendSession(token: string): Promise<extendSessionMutation> {
    // this.apiService.apollo.
    const variables = <extendSessionMutationVariables>{ token };
    return new Promise<extendSessionMutation>((resolve, reject) => {
      this.apiService.apollo.mutate<extendSessionMutation, extendSessionMutationVariables>({
        mutation: EXTEND_SESSION,
        variables,
      }).subscribe((x) => {
        resolve(x.data as extendSessionMutation);
      }, reject);
    });
  }

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
