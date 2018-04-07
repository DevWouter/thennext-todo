import { Injectable } from "@angular/core";
import gql from "graphql-tag";
import { ApiService } from ".";
import { getTaskListsQuery } from "./graphql-types/operation-result-types";

const GET_TASK_LISTS = gql`
query getTaskLists {
  taskLists {
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
}
