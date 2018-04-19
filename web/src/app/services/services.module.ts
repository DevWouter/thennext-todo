import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { AccountService } from "./account.service";
import { ApiService } from "./api.service";
import { NavigationService } from "./navigation.service";
import { SessionService } from "./session.service";
import { StorageService } from "./storage.service";
import { TaskParseService } from "./task-parse.service";
import { TaskListService } from "./task-list.service";
import { TaskService } from "./task.service";
import { ContextService } from "./context.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    AccountService,
    ApiService,
    NavigationService,
    SessionService,
    StorageService,
    TaskParseService,
    TaskListService,
    TaskService,
    ContextService,
  ]
})
export class ServicesModule {
}
