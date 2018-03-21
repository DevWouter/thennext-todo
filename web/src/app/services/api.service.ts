import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { DocumentNode } from "graphql";
import { StorageService, StorageKey } from "./storage.service";
import { setContext } from "apollo-link-context";
import { HttpHeaders } from "@angular/common/http";
export interface MutationResult<T> {
  data: T;
}

@Injectable()
export class ApiService {
  private _sessionToken: string = undefined;

  constructor(
    private httpLink: HttpLink,
    private storageService: StorageService,
    public apollo: Apollo,
  ) {
    // On load always retrieve the session key.
    this._sessionToken = this.storageService.get(StorageKey.SESSION_TOKEN);
    this.setupApolloClient();
  }


  setSessionToken(token: string, expireAt: string) {
    // Store session token first and then also store it so we can retrieve it later.
    this._sessionToken = token;
    this.storageService.set(StorageKey.SESSION_TOKEN, token);
  }

  private createApollo_Http() {
    return this.httpLink.create({});
  }

  private createApollo_Authentication() {
    return setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      const token = this.storageService.get(StorageKey.SESSION_TOKEN);
      // return the headers to the context so httpLink can read them
      // in this example we assume headers property exists
      // and it is an instance of HttpHeaders
      if (!headers) {
        headers = new HttpHeaders();
      }
      if (!token) {
        return {};
      } else {
        return {
          headers: headers.append("Authorization", `Bearer ${token}`)
        };
      }
    });
  }

  private setupApolloClient() {
    const http = this.createApollo_Http();
    const auth = this.createApollo_Authentication();

    const link = auth.concat(http);
    this.apollo.create({
      // By default, this client will send queries to the
      // `/graphql` endpoint on the same host
      link: link,
      cache: new InMemoryCache(),
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
