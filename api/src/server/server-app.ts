import { injectable } from "inversify";
import {
    ChecklistItemService,
    ScoreShiftService,
    TaskListService,
    TaskListShareService,
    TaskRelationService,
    TaskService,
    UrgencyLapService,
} from "../services";


@injectable()
export class ServerApp {
    constructor(
        private readonly checklistItemService: ChecklistItemService,
        private readonly tagScoringService: ScoreShiftService,
        private readonly taskListService: TaskListService,
        private readonly taskListShareService: TaskListShareService,
        private readonly taskRelationService: TaskRelationService,
        private readonly taskService: TaskService,
        private readonly urgencyLapService: UrgencyLapService,
    ) {
    }
}
