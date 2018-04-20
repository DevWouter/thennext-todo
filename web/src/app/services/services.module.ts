import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { AccountService } from "./account.service";
import { ApiService } from "./api.service";
import { ContextService } from "./context.service";
import { NavigationService } from "./navigation.service";
import { SessionService } from "./session.service";
import { StorageService } from "./storage.service";
import { TaskListService } from "./task-list.service";
import { TaskParseService } from "./task-parse.service";
import { TaskService } from "./task.service";
import { TaskViewService } from "./task-view.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    AccountService,
    ApiService,
    ContextService,
    NavigationService,
    SessionService,
    StorageService,
    TaskListService,
    TaskParseService,
    TaskService,
    TaskViewService,
  ]
})
export class ServicesModule {
}
