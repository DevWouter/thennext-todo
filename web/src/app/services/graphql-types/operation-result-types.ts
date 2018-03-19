/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface createAccountMutationVariables {
  email: string,
  password: string,
};

export interface createAccountMutation {
  createAccount:  {
    __typename: "Account",
    uuid: string,
    email: string | null,
  } | null,
};

export interface createSessionMutationVariables {
  email: string,
  password: string,
};

export interface createSessionMutation {
  // The user creates a session to which can be used as verification for all other operations.
  createSession:  {
    __typename: "Session",
    // The token of the session
    token: string | null,
    // When the token will expire
    expireAt: string | null,
  } | null,
};
