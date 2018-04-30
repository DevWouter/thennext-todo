import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { AccountService } from "./account.service";
import { ApiService } from "./api.service";
import { ChecklistItemService } from "./checklist-item.service";
import { ContextService } from "./context.service";
import { NavigationService } from "./navigation.service";
import { ScoreShiftService } from "./score-shift.service";
import { SessionService } from "./session.service";
import { StorageService } from "./storage.service";
import { TaskEventService } from "./task-event.service";
import { TaskListService } from "./task-list.service";
import { TaskParseService } from "./task-parse.service";
import { TaskRelationService } from "./task-relation.service";
import { TaskScoreService } from "./task-score.service";
import { TaskService } from "./task.service";
import { TaskViewService } from "./task-view.service";
import { SearchService } from "./search.service";
import { RelationViewService } from "./relation-view.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    AccountService,
    ApiService,
    ChecklistItemService,
    ContextService,
    NavigationService,
    ScoreShiftService,
    SessionService,
    StorageService,
    TaskEventService,
    TaskListService,
    TaskParseService,
    TaskRelationService,
    TaskScoreService,
    TaskService,
    TaskViewService,
    SearchService,
    RelationViewService,
  ]
})
export class ServicesModule {
}
