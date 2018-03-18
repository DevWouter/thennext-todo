import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountService } from "./account.service";
import { HttpClientModule } from "@angular/common/http";
import { ApolloModule, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApiService } from "./api.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule,
  ],
  declarations: [],
  providers: [AccountService,
    ApiService]
})
export class ServicesModule {
}
