import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { AccountService } from "./account.service";
import { ApiService } from "./api.service";
import { SessionService } from "./session.service";
import { StorageService } from "./storage.service";
import { TaskListService } from "./task-list.service";
import { TaskService } from "./task.service";
import { NavigationService } from "./navigation.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    AccountService,
    ApiService,
    SessionService,
    StorageService,
    TaskListService,
    TaskService,
    NavigationService,
  ]
})
export class ServicesModule {
}
