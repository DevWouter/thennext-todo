import { Injectable } from "@angular/core";
import gql from "graphql-tag";
import { ApiService } from ".";
import { getTaskListsQuery, createTaskListMutation, createTaskListMutationVariables } from "./graphql-types/operation-result-types";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { resultKeyNameFromField } from "apollo-utilities";

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

interface TaskList {
  name: string;
  uuid: string;
  primary: boolean;
}

@Injectable()
export class TaskListService {
  private _taskLists = new BehaviorSubject<TaskList[]>(undefined);
  public get taskLists(): Observable<TaskList[]> {
    return this._taskLists.filter(x => x !== undefined);
  }

  constructor(
    private apiService: ApiService,
  ) {
    this.subscribeToTaskList();
  }

  private subscribeToTaskList(): void {

    const query = this.apiService.apollo.watchQuery({
      query: GET_TASK_LISTS,
      fetchPolicy: "cache-first",
    });

    query.valueChanges.subscribe((x) => {
      const data = x.data as getTaskListsQuery;
      if (data) {
        this._taskLists.next(data.taskLists);
      }
    });

  }

  createTaskList(name: string): void {
    this.apiService.apollo.mutate<createTaskListMutation, createTaskListMutationVariables>({
      mutation: CREATE_TASK_LIST_MUTATION,
      variables: <createTaskListMutationVariables>{
        name: name,
      },
      update: (store, mutationResult) => {
        // On adding a task, also update the lists of tasks.
        const mutationData = mutationResult.data as createTaskListMutation;
        const data = store.readQuery({ query: GET_TASK_LISTS }) as getTaskListsQuery;
        data.taskLists.push(mutationData.createTaskList);
        store.writeQuery({
          query: GET_TASK_LISTS,
          data
        });
      },
    }).subscribe();
  }
}
