import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

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

}
