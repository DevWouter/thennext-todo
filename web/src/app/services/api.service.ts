import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { DocumentNode } from "graphql";

export interface MutationResult<T> {
  data: T;
}

@Injectable()
export class ApiService {

  constructor(public apollo: Apollo,
    httpLink: HttpLink) {
    apollo.create({
      // By default, this client will send queries to the
      // `/graphql` endpoint on the same host
      link: httpLink.create({}),
      cache: new InMemoryCache()
    });
  }

  // async mutate<TR>(mutation: DocumentNode, variables?: any): Promise<MutationResult<TR>> {
  //   return new Promise<MutationResult<TR>>((resolve, reject) => {
  //     this.apollo.mutate({
  //       mutation,
  //       variables,
  //     }).subscribe(x => {
  //       resolve(<MutationResult<TR>>{
  //         data: x.data
  //       });
  //     }, (reason) => reject(reason));
  //   });
  // }
}
