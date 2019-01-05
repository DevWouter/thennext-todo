import { injectable } from "inversify";
import {
    AccountService,
    ChecklistItemService,
    ScoreShiftService,
    TaskListService,
    TaskRelationService,
    TaskService,
    UrgencyLapService,
    MailService,
} from "../services";
import { JobManager } from "./job-manager";


@injectable()
export class ServerApp {
    constructor(
        private readonly accountService: AccountService,
        private readonly checklistItemService: ChecklistItemService,
        private readonly tagScoringService: ScoreShiftService,
        private readonly taskListService: TaskListService,
        private readonly taskRelationService: TaskRelationService,
        private readonly taskService: TaskService,
        private readonly urgencyLapService: UrgencyLapService,
        private readonly jobManager: JobManager,
        // private readonly mailService: MailService,
    ) {
    }
}
