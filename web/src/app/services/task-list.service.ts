import { Injectable } from "@angular/core";
import gql from "graphql-tag";
import { ApiService } from ".";
import { getTaskListsQuery, createTaskListMutation, createTaskListMutationVariables } from "./graphql-types/operation-result-types";

const GET_TASK_LISTS = gql`
query getTaskLists {
  taskLists {
    uuid
    primary
    name
  }
}`;

const CREATE_TASK_LIST_MUTATION = gql`
mutation createTaskList($name: String!) {
  createTaskList(name: $name) {
    uuid
    primary
    name
  }
}`;

@Injectable()
export class TaskListService {

  constructor(
    private apiService: ApiService,
  ) { }

  async getTaskLists(): Promise<getTaskListsQuery> {
    return new Promise<getTaskListsQuery>((resolve, reject) => {
      this.apiService.apollo.query({
        query: GET_TASK_LISTS
      }).subscribe((x) => {
        resolve(x.data as getTaskListsQuery);
      }, reject);
    });
  }

  async createTaskList(name: string): Promise<createTaskListMutation> {
    return new Promise<createTaskListMutation>((resolve, reject) => {
      this.apiService.apollo.mutate<createTaskListMutation, createTaskListMutationVariables>({
        mutation: CREATE_TASK_LIST_MUTATION,
        variables: <createTaskListMutationVariables>{
          name: name,
        }
      }).subscribe((x) => {
        resolve(x.data as createTaskListMutation);
      }, reject);
    });
  }
}
