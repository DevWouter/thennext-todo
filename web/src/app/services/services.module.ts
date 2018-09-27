import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { AccountService } from "./account.service";
import { ApiEventService } from "./api-event.service";
import { ApiService } from "./api.service";
import { ChecklistItemService } from "./checklist-item.service";
import { ContextService } from "./context.service";
import { FocusService } from "./focus.service";
import { MediaViewService } from "./media-view.service";
import { MessageService } from "./message.service";
import { NavigationService } from "./navigation.service";
import { RelationViewService } from "./relation-view.service";
import { ScoreShiftService } from "./score-shift.service";
import { SearchService } from "./search.service";
import { SessionService } from "./session.service";
import { StorageService } from "./storage.service";
import { TaskEventService } from "./task-event.service";
import { TaskListRightService } from "./task-list-right.service";
import { TaskListService } from "./task-list.service";
import { TaskListShareTokenService } from "./task-list-share-token.service";
import { TaskParseService } from "./task-parse.service";
import { TaskRelationService } from "./task-relation.service";
import { TaskScoreService } from "./task-score.service";
import { TaskService } from "./task.service";
import { TokenService } from "./token.service";
import { UrgencyLapService } from "./urgency-lap.service";
import { ConnectionStateService } from "./connection-state.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [],
  providers: [
    AccountService,
    ApiEventService,
    ApiService,
    ChecklistItemService,
    ContextService,
    FocusService,
    MediaViewService,
    MessageService,
    NavigationService,
    RelationViewService,
    ScoreShiftService,
    SearchService,
    SessionService,
    StorageService,
    TaskEventService,
    TaskListRightService,
    TaskListService,
    TaskListShareTokenService,
    TaskParseService,
    TaskRelationService,
    TaskScoreService,
    TaskService,
    TokenService,
    UrgencyLapService,
    ConnectionStateService,
  ]
})
export class ServicesModule {
}
