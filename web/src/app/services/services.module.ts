import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { ApolloModule, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { AccountService } from "./account.service";
import { ApiService } from "./api.service";
import { SessionService } from "./session.service";
import { StorageService } from "./storage.service";
import { TaskListService } from "./task-list.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
  ],
  declarations: [],
  providers: [
    AccountService,
    ApiService,
    SessionService,
    StorageService,
    TaskListService,
  ]
})
export class ServicesModule {
}
