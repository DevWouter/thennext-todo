/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum TaskStatus {
  active = "active",
  done = "done",
  todo = "todo",
}


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

export interface extendSessionMutationVariables {
  token: string,
};

export interface extendSessionMutation {
  // Extend the session of the given token
  // Returns an error if token is not of the current user.
  // Returns an error if token does not exist
  extendSession:  {
    __typename: "Session",
    // The token of the session
    token: string | null,
    // When the token will expire
    expireAt: string | null,
  },
};

export interface getTaskListsQuery {
  taskLists:  Array< {
    __typename: "TaskList",
    uuid: string,
    primary: boolean,
    name: string,
  } | null > | null,
};

export interface createTaskListMutationVariables {
  name: string,
};

export interface createTaskListMutation {
  createTaskList:  {
    __typename: "TaskList",
    uuid: string,
    primary: boolean,
    name: string,
  } | null,
};

export interface getTasksQuery {
  tasks:  Array< {
    __typename: "Task",
    uuid: string | null,
    taskListUuid: string | null,
    title: string | null,
    status: TaskStatus | null,
  } | null > | null,
};
