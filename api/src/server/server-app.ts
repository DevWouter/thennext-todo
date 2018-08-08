import { injectable } from "inversify";
import {
    AccountService,
    ChecklistItemService,
    ScoreShiftService,
    TaskListRightService,
    TaskListService,
    TaskListShareService,
    TaskRelationService,
    TaskService,
    UrgencyLapService,
    MailService,
} from "../services";


@injectable()
export class ServerApp {
    constructor(
        private readonly accountService: AccountService,
        // private readonly checklistItemService: ChecklistItemService,
        private readonly tagScoringService: ScoreShiftService,
        private readonly taskListRightService: TaskListRightService,
        private readonly taskListService: TaskListService,
        private readonly taskListShareService: TaskListShareService,
        private readonly taskRelationService: TaskRelationService,
        private readonly taskService: TaskService,
        private readonly urgencyLapService: UrgencyLapService,
        // private readonly mailService: MailService,
    ) {
    }
}
